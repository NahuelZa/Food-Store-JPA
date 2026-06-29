package com.tp.jpa.repository;

import com.tp.jpa.model.Categoria;
import jakarta.persistence.EntityManager;

import java.util.Optional;

/**
 * Repositorio de Categoria. Hereda todo el CRUD de BaseRepository; no
 * requiere métodos adicionales.
 */
public class CategoriaRepository extends BaseRepository<Categoria> {

    public CategoriaRepository() {
        super(Categoria.class);
    }
  //(Ayuda IA)
    public Optional<Categoria> buscarConProductos(Long id) {
        EntityManager em = emf.createEntityManager();
        try {
            Categoria categoria = em.find(Categoria.class, id);
            if (categoria != null) {
                categoria.getProductos().size();
            }

            return Optional.ofNullable(categoria);
        } finally {
            em.close();
        }
    }
}
