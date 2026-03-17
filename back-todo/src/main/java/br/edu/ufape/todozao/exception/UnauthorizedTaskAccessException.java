package br.edu.ufape.todozao.exception;

public class UnauthorizedTaskAccessException extends RuntimeException {
    public UnauthorizedTaskAccessException() {
        super("Usuário não pode acessar essa task");
    }
}