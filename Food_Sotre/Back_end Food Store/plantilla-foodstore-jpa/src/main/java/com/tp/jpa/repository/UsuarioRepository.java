package com.tp.jpa.repository;

import com.tp.jpa.model.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio de Usuario. Además del CRUD heredado implementa la búsqueda
 * de un usuario activo por su mail.
 */
public class UsuarioRepository extends BaseRepository<Usuario> {

    public UsuarioRepository() {
        super(Usuario.class);
    }

    /**
     * Retorna el usuario activo con el mail indicado.
     */
    public Optional<Usuario> buscarPorMail(String mail) {
        EntityManager em = emf.createEntityManager();
        try {
            //Selecciono los usuario de la lista Usuario donde el mail sea igual a los pasadors por paramtro (String email)
            String jpql = "SELECT u FROM Usuario u WHERE u.mail = :mail AND u.eliminado = false";

            List<Usuario> q = em.createQuery(jpql, Usuario.class)
                    .setParameter("mail", mail)
                    .getResultList();

            // Si no esta vacia retorno el primer valor encontrado
            if (!q.isEmpty()) {
                return Optional.of(q.get(0));
            } else {
                return Optional.empty();

            }
        } finally {
            em.close();
        }
    }
    //(Ayuda IA)
    public Optional<Usuario> buscarConPedidos(Long id) {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT u FROM Usuario u LEFT JOIN FETCH u.pedidos WHERE u.id = :id";
            List<Usuario> resultados = em.createQuery(jpql, Usuario.class)
                    .setParameter("id", id)
                    .getResultList();
            return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));

        } catch (Exception e) {
            return Optional.empty();
        } finally {
            em.close();
        }
    }
}
