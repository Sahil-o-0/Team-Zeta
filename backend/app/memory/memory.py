import json
import re
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.candidate import Candidate
from app.models.employee import Employee
from app.models.policy import Policy

class VectorMemoryStore:
    """
    Simulates high-fidelity episodic and vector database search capabilities.
    Uses TF-IDF term overlap and Jaccard-Cosine keyword similarity to find
    relevant context across candidate files, resumes, and HR policy files.
    """
    def __init__(self):
        self.index: List[Dict[str, Any]] = []

    def clear(self):
        self.index.clear()

    def add_document(self, doc_id: str, text: str, category: str, metadata: Dict[str, Any] = None):
        """Indexes a document with text for vector-based semantic retrieval"""
        self.index.append({
            "id": doc_id,
            "text": text.lower() if text else "",
            "category": category,
            "metadata": metadata or {}
        })

    def search(self, query: str, category: str = None, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Runs a simulated semantic vector lookup using token-matching weights.
        Returns top-k documents sorted by score.
        """
        if not query:
            return []

        query_tokens = set(re.findall(r"\w+", query.lower()))
        results = []

        for doc in self.index:
            if category and doc["category"] != category:
                continue
            
            # Simple term-frequency and token overlap score
            doc_tokens = set(re.findall(r"\w+", doc["text"]))
            intersection = query_tokens.intersection(doc_tokens)
            
            if not intersection:
                score = 0.0
            else:
                # Jaccard index similarity score (overlap ratio)
                score = len(intersection) / len(query_tokens.union(doc_tokens))
            
            # Boost score if query keywords are found consecutively
            if query.lower() in doc["text"]:
                score += 0.5
                
            if score > 0:
                results.append((score, doc))

        # Sort descending by score
        results.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in results[:limit]]

class AssociativeGraphStore:
    """
    Simulates a long-term company graph database (similar to Neo4j).
    Maintains nodes and weighted directed/undirected edges representing
    organizational structures, dependencies, preferences, and action histories.
    """
    def __init__(self):
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: List[Tuple[str, str, str, Dict[str, Any]]] = []  # (source, target, relation, attributes)

    def clear(self):
        self.nodes.clear()
        self.edges.clear()

    def add_node(self, node_id: str, label: str, properties: Dict[str, Any] = None):
        self.nodes[node_id] = {
            "id": node_id,
            "label": label,
            "properties": properties or {}
        }

    def add_edge(self, source_id: str, target_id: str, relation: str, properties: Dict[str, Any] = None):
        self.edges.append((source_id, target_id, relation, properties or {}))

    def get_neighbors(self, node_id: str, relation: str = None) -> List[Dict[str, Any]]:
        """Returns direct neighbors linked to node_id, optionally filtered by relationship type"""
        neighbors = []
        for src, tgt, rel, props in self.edges:
            if src == node_id and (not relation or rel == relation):
                if tgt in self.nodes:
                    neighbors.append({
                        "node": self.nodes[tgt],
                        "edge_properties": props,
                        "direction": "out"
                    })
            elif tgt == node_id and (not relation or rel == relation):
                if src in self.nodes:
                    neighbors.append({
                        "node": self.nodes[src],
                        "edge_properties": props,
                        "direction": "in"
                    })
        return neighbors

    def find_shortest_path(self, start_id: str, end_id: str) -> List[str]:
        """Simple BFS to find the shortest relationship chain between two nodes"""
        if start_id not in self.nodes or end_id not in self.nodes:
            return []
        
        queue = [[start_id]]
        visited = {start_id}
        
        while queue:
            path = queue.pop(0)
            node = path[-1]
            
            if node == end_id:
                return path
            
            # Find neighbors
            for src, tgt, _, _ in self.edges:
                neighbor = None
                if src == node:
                    neighbor = tgt
                elif tgt == node:
                    neighbor = src
                    
                if neighbor and neighbor not in visited:
                    visited.add(neighbor)
                    new_path = list(path)
                    new_path.append(neighbor)
                    queue.append(new_path)
        return []

# Singleton memory instances for active sessions
vector_memory = VectorMemoryStore()
graph_memory = AssociativeGraphStore()

# High level memory facade interfacing Relational + Vector + Graph
class OrganizationalMemory:
    """
    Facade coordinating all memory modules. It exposes a unified API
    to write to SQL (Relational) and synchronously update episodic (Vector)
    and graph-link (Associative) indexes.
    """
    @staticmethod
    def sync_all_memory(db: Session):
        """
        Synchronizes all SQL records into vector and graph simulators
        to make search interfaces instantly intelligent upon boot.
        """
        vector_memory.clear()
        graph_memory.clear()
        
        # 1. Sync Policies
        policies = db.query(Policy).all()
        for p in policies:
            vector_memory.add_document(
                doc_id=f"policy_{p.id}",
                text=f"{p.title} {p.category} {p.policy_text}",
                category="policy",
                metadata={"id": p.id, "title": p.title, "category": p.category}
            )
            graph_memory.add_node(f"policy_{p.id}", "Policy", {"title": p.title, "category": p.category})

        # 2. Sync Employees & Managers hierarchy
        employees = db.query(Employee).all()
        for emp in employees:
            vector_memory.add_document(
                doc_id=f"employee_{emp.id}",
                text=f"{emp.name} {emp.role} {emp.department} {emp.recommendation or ''}",
                category="employee",
                metadata={"id": emp.id, "name": emp.name, "role": emp.role, "department": emp.department}
            )
            # Add Node to graph
            graph_memory.add_node(f"employee_{emp.id}", "Employee", {
                "name": emp.name,
                "role": emp.role,
                "department": emp.department,
                "salary": emp.salary
            })
            
        # Add Hierarchical edges in second pass
        for emp in employees:
            if emp.manager_id:
                graph_memory.add_edge(
                    source_id=f"employee_{emp.manager_id}",
                    target_id=f"employee_{emp.id}",
                    relation="MANAGES",
                    properties={"weight": 1.0}
                )

        # 3. Sync Candidates
        candidates = db.query(Candidate).all()
        for cand in candidates:
            skills_str = cand.skills or ""
            vector_memory.add_document(
                doc_id=f"candidate_{cand.id}",
                text=f"{cand.name} {cand.skills} {cand.source} {cand.recommendation_reason or ''}",
                category="candidate",
                metadata={"id": cand.id, "name": cand.name, "skills": skills_str, "status": cand.status}
            )
            graph_memory.add_node(f"candidate_{cand.id}", "Candidate", {
                "name": cand.name,
                "skills": skills_str,
                "status": cand.status
            })
            
            # Connect candidate node to department preferences
            dept = "Engineering" if "software" in cand.skills.lower() or "python" in cand.skills.lower() else "Sales"
            graph_memory.add_node(f"dept_{dept.lower()}", "Department", {"name": dept})
            graph_memory.add_edge(f"candidate_{cand.id}", f"dept_{dept.lower()}", "APPLIED_TO")
