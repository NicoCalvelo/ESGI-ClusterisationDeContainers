# 🎨 Pixel War

Application collaborative de type r/place — grille partagée 50×50 pixels.

## Choix techniques

- Frontend => **React + nginx** Build statique léger, nginx comme reverse proxy
- Backend => **Express (Node.js)** Node.js / Express, 2 routes REST (`GET /api/pixels`, `PUT /api/pixel`) + health-check (`GET /health`)
- BDD => **PostgreSQL** simple facile à configurer
- Conteneurisation => **Docker multi-stage** Image frontend ~25MB (nginx:alpine)
- Orchestration => **Helm chart** Déploiement déclaratif, configurable via `values.yaml`
- CI/CD => **GitHub Actions** Build + push images GHCR, lint Helm
- Résilience => **Liveness + Readiness probes** Redémarrage auto si crash, pas de trafic si pas prêt
- Sécurité => **Secrets, NetworkPolicies** Credentials en Secret K8s, réseau segmenté
- Persistance => **PersistentVolumeClaim** Les données survivent aux redémarrages

## Lancement local (Docker Compose)

```bash
docker-compose up --build
```

Accès : http://localhost:8080

## Déploiement Kubernetes (Helm)

### Prérequis

- Un cluster Kubernetes (Kind, Minikube, etc.)
- Helm 3 installé

### Créer le cluster Kind

```bash
kind create cluster --name pixel-war
```

### Installer le chart

```bash
helm install pixel-war ./helm/pixel-war
```

### Surcharger les valeurs (ex: credentials)

```bash
helm install pixel-war ./helm/pixel-war \
  --set database.password=monMotDePasse
```

### Vérifier le déploiement

```bash
kubectl get pods
kubectl get svc
```

### Accéder à l'application

```bash
kubectl port-forward svc/pixel-war-pixel-war-frontend 8080:80
```

Puis ouvrir http://localhost:8080

### Désinstaller

```bash
helm uninstall pixel-war
```

## Structure du projet

```
├── backend/                 # API Node.js/Express
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── Dockerfile
├── projet-cdc/              # Frontend React
│   ├── src/App.js
│   ├── nginx.conf
│   └── Dockerfile           # Multi-stage build
├── helm/pixel-war/          # Chart Helm
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment-*.yaml # Deployments (frontend, backend, db)
│       ├── service-*.yaml    # Services
│       ├── secret.yaml       # Credentials PostgreSQL
│       ├── configmap.yaml    # Config backend
│       ├── pvc.yaml          # Volume persistant
│       └── networkpolicy.yaml# Segmentation réseau
├── .github/workflows/ci.yaml # CI/CD GitHub Actions
├── docker-compose.yaml       # Dev local
└── README.md
```

## CI/CD

Le pipeline GitHub Actions (`push` sur `main`) :

1. **Build & push** des images Docker vers GitHub Container Registry (GHCR)
2. **Lint** du chart Helm

Les images sont taguées avec `latest` et le SHA du commit.

## Auteur

Nico Calvelo — ESGI Master 2 Architecture Logicielle
