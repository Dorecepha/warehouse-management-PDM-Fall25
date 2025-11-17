package org.pdm.backend.repository;

import org.pdm.backend.enums.TransactionStatus;
import org.pdm.backend.model.Transaction;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository {
    Transaction save(Transaction transaction);
    Transaction update(Transaction transaction);
    Optional<Transaction> findById(Long id);
    List<Transaction> findAllByMonthAndYear(int month, int year);
    List<Transaction> searchTransactions( int page, int size,String searchText);
    List<Transaction> findAllFilteredPaged(String filter, int page, int size);
    long countFiltered(String filter);

    Transaction updateStatus(Long id, TransactionStatus status);


}
