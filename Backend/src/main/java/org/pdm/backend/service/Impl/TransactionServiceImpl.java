package org.pdm.backend.service.Impl;

import org.pdm.backend.enums.TransactionStatus;
import org.pdm.backend.enums.TransactionType;
import org.pdm.backend.exception.NameValueRequiredException;
import org.pdm.backend.exception.NotFoundException;
import org.pdm.backend.model.Product;
import org.pdm.backend.model.Supplier;
import org.pdm.backend.model.Transaction;
import org.pdm.backend.model.User;
import org.pdm.backend.repository.ProductRepository;
import org.pdm.backend.repository.TransactionRepository;
import org.pdm.backend.service.TransactionService;
import org.pdm.backend.service.UserService;
import org.pdm.backend.wrappers.Response;
import org.pdm.backend.wrappers.TransactionRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

        private final TransactionRepository transactionRepository;
        private final SupplierRepository supplierRepository;
        private final UserService userService;
        private final ProductRepository productRepository;

        @Override
        public Response restockInventory(TransactionRequest transactionRequest) {

            Long productId = transactionRequest.getProductId();
            Long supplierId = transactionRequest.getSupplierId();
            Integer quantity = transactionRequest.getQuantity();

            if (supplierId == null)
                throw new NameValueRequiredException("Supplier Id is Required");

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new NotFoundException("Product Not Found"));

            Supplier supplier = supplierRepository.findById(supplierId)
                    .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

            User user = userService.getCurrentLoggedInUser();

            // update stock and resave
            product.setStockQuantity(product.getStockQuantity() + quantity);
            productRepository.update(product);

            Transaction transaction = new Transaction();
            transaction.setTransactionType(TransactionType.PURCHASE);
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setProductId(product.getId());
            transaction.setUserId(user.getId());
            transaction.setSupplierId(supplier.getId());
            transaction.setTotalProducts(quantity);
            transaction.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            transaction.setDescription(transactionRequest.getDescription());
            transaction.setCreatedAt(LocalDateTime.now());

            transactionRepository.save(transaction);

            return Response.builder()
                    .status(200)
                    .message("Transaction Made Successfully")
                    .build();
        }

        @Override
        public Response sell(TransactionRequest transactionRequest) {

            Long productId = transactionRequest.getProductId();
            Integer quantity = transactionRequest.getQuantity();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new NotFoundException("Product Not Found"));

            User user = userService.getCurrentLoggedInUser();

            // update stock and resave
            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.update(product);

            Transaction transaction = new Transaction();
            transaction.setTransactionType(TransactionType.SALE);
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setProductId(product.getId());
            transaction.setUserId(user.getId());
            transaction.setTotalProducts(quantity);
            transaction.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            transaction.setDescription(transactionRequest.getDescription());
            transaction.setCreatedAt(LocalDateTime.now());

            transactionRepository.save(transaction);

            return Response.builder()
                    .status(200)
                    .message("Transaction Sold Successfully")
                    .build();
        }

        @Override
        public Response returnToSupplier(TransactionRequest transactionRequest) {

            Long productId = transactionRequest.getProductId();
            Long supplierId = transactionRequest.getSupplierId();
            Integer quantity = transactionRequest.getQuantity();

            if (supplierId == null)
                throw new NameValueRequiredException("Supplier Id is Required");

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new NotFoundException("Product Not Found"));

            Supplier supplier = supplierRepository.findById(supplierId)
                    .orElseThrow(() -> new NotFoundException("Supplier Not Found"));

            User user = userService.getCurrentLoggedInUser();

            // update stock and resave
            product.setStockQuantity(product.getStockQuantity() - quantity);
            productRepository.update(product);

            Transaction transaction = new Transaction();
            transaction.setTransactionType(TransactionType.RETURN_TO_SUPPLIER);
            transaction.setStatus(TransactionStatus.PROCESSING);
            transaction.setProductId(product.getId());
            transaction.setUserId(user.getId());
            transaction.setSupplierId(supplier.getId());
            transaction.setTotalProducts(quantity);
            transaction.setTotalPrice(BigDecimal.ZERO);
            transaction.setDescription(transactionRequest.getDescription());
            transaction.setCreatedAt(LocalDateTime.now());

            transactionRepository.save(transaction);

            return Response.builder()
                    .status(200)
                    .message("Transaction Returned Successfully Initialized")
                    .build();
        }

        @Override
        public Response getAllTransactions(int page, int size, String searchText) {

            // manual pagination logic if needed
            List<Transaction> transactions = transactionRepository.searchTransactions( page, size, searchText);

            return Response.builder()
                    .status(200)
                    .message("success")
                    .transactions(transactions)
                    .build();
        }

        @Override
        public Response getTransactionById(Long id) {

            Transaction transaction = transactionRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Transaction Not Found"));

            return Response.builder()
                    .status(200)
                    .message("success")
                    .transaction(transaction)
                    .build();
        }

        @Override
        public Response getAllTransactionByMonthAndYear(int month, int year) {

            List<Transaction> transactions = transactionRepository.findAllByMonthAndYear(month, year);

            return Response.builder()
                    .status(200)
                    .message("success")
                    .transactions(transactions)
                    .build();
        }

        @Override
        public Response updateTransactionStatus(Long transactionId, TransactionStatus transactionStatus) {

            Transaction existingTransaction = transactionRepository.findById(transactionId)
                    .orElseThrow(() -> new NotFoundException("Transaction Not Found"));

            existingTransaction.setStatus(transactionStatus);
            existingTransaction.setUpdateAt(LocalDateTime.now());

            transactionRepository.update(existingTransaction);

            return Response.builder()
                    .status(200)
                    .message("Transaction Status Successfully Updated")
                    .build();
        }
    }

