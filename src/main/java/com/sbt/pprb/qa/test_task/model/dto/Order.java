package com.sbt.pprb.qa.test_task.model.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "orders")
public class Order extends AuditEntity {

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser owner;
    private Boolean active;
    private Integer balance;
}