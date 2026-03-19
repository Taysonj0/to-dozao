"use client";

type CardProps = {
  titulo: string;
  descricao: string;
};

export default function Card({ titulo, descricao }: CardProps) {
  return (
    <div style={styles.card}>
      <h2 style={styles.titulo}>{titulo}</h2>
      <p style={styles.descricao}>{descricao}</p>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px",
    width: "250px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  titulo: {
    fontSize: "18px",
    marginBottom: "8px",
  },
  descricao: {
    fontSize: "14px",
  }
};
