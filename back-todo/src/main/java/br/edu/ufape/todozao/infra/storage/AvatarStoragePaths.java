package br.edu.ufape.todozao.infra.storage;

import java.nio.file.Path;
import java.nio.file.Paths;

public final class AvatarStoragePaths {

    public static final Path UPLOADS_ROOT = Paths.get(System.getProperty("user.home"), ".todozao", "uploads")
            .toAbsolutePath()
            .normalize();

    public static final Path AVATARS_ROOT = UPLOADS_ROOT.resolve("avatars").normalize();

    private AvatarStoragePaths() {
    }
}