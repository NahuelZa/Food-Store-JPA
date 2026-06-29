package com.tp.jpa.model;

import com.tp.jpa.model.enums.EstadoPedido;
import com.tp.jpa.model.enums.FormaPago;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true, exclude = {"detalles"})
@EqualsAndHashCode(callSuper = true)
public class Pedido extends Base implements Calculable {

    @Column(name = "fecha", updatable = false)
    @Builder.Default
    private LocalDate fecha = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "estado",nullable = false, length = 30)
    @Builder.Default
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    @Column(name = "total", nullable = false)
    @Builder.Default
    private Double total = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pago",nullable = false, length = 20)
    private FormaPago formaPago;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    @Builder.Default
    private Set<DetallePedido> detalles = new HashSet<>();

    public void addDetallePedido(int cantidad, Producto producto) {
        Optional<DetallePedido> detalleExistente = this.detalles.stream()
                .filter(d -> d.getProducto().getId().equals(producto.getId()))
                .findFirst();

        if (detalleExistente.isPresent()) {
            DetallePedido detalle = detalleExistente.get();
            int nuevaCantidad = detalle.getCantidad() + cantidad;
            detalle.setCantidad(nuevaCantidad);
            detalle.calcularSubtotal();
            this.total+=detalle.getSubtotal();
        } else {
            DetallePedido nuevoDetalle = DetallePedido.builder()
                    .cantidad(cantidad)
                    .producto(producto)
                    .build();
            nuevoDetalle.calcularSubtotal();
            this.detalles.add(nuevoDetalle);
            this.total+=nuevoDetalle.getSubtotal();
        }
    }

    @Override
    public void calcularTotal() {
        double acumulador = 0.0;
        for (DetallePedido detalle : detalles) {
            if (detalle.getSubtotal() != null) {
                acumulador += detalle.getSubtotal();
            }
        }
        this.total = acumulador;
    }


}
