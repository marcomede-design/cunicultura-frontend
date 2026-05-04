import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // captura o :id da URL
import api from "../services/api";
import Tree from "react-d3-tree";
import tema from "../styles/tema";

export default function Genealogia() {
  const { id } = useParams(); // pega o idAnimal da URL
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/genealogia/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Erro ao carregar genealogia:", err));
  }, [id]);

  if (!data) return <p>Carregando genealogia...</p>;

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Tree
        data={data}
        orientation="vertical"
        pathFunc="elbow"
        translate={{ x: 300, y: 50 }}
        styles={{
          links: { stroke: tema.primaria },
          nodes: {
            node: { circle: { fill: tema.primariaClara } },
            leafNode: { circle: { fill: tema.acento } }
          }
        }}
      />
    </div>
  );
}