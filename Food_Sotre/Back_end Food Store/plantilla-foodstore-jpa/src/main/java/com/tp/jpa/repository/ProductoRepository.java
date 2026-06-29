package com.tp.jpa.repository;

import com.tp.jpa.model.Categoria;
import com.tp.jpa.model.Producto;
import jakarta.persistence.EntityManager;

import java.util.List;

/**
 * Repositorio de Producto. Además del CRUD heredado implementa la consulta
 * de productos activos por categoría.
 */
public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository() {
        super(Producto.class);
    }

    /**
     * Retorna los productos activos que pertenecen a la categoría indicada.
     */
    //Abro el entity y escibo la consulta seleciciono los productos de la categoria y muestro los los productos de la categoria que se le paso por el parametro "id"
    public List<Producto> buscarPorCategoria(Long categoriaId) {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT p FROM Categoria c JOIN c.productos p WHERE c.id =:catId AND p.eliminado = false";
            return em.createQuery(jpql, Producto.class)
                    .setParameter("catId", categoriaId)
                    .getResultList();
        } finally {
            em.close();
        }
    }
    //(Ayuda con IA) Para poder mostrar Categoria en los productos
    public List<Object[]> listarProductosConCategoria() {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT p, c FROM Categoria c JOIN c.productos p WHERE p.eliminado = false AND c.eliminado = false";
            return em.createQuery(jpql, Object[].class).getResultList();
        } finally {
            em.close();
        }
    }
}

