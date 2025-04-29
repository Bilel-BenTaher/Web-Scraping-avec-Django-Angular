Voici une version **corrigée, structurée et adaptée à un débutant**, avec une meilleure hiérarchie et des clarifications supplémentaires, tout en conservant ton contenu. J’ai reformulé certains passages pour les rendre plus pédagogiques et faciles à suivre :

---

# 📘 Projet Django + Angular – Scraping de citations

Application web permettant de **scraper des citations** depuis [Quotes to Scrape (JS)](https://quotes.toscrape.com/js/), de les **stocker dans une base de données via une API Django REST**, et de les **afficher dans une interface Angular** avec **filtres dynamiques** et **pagination**.

---

## 📋 Prérequis

Avant de commencer, assure-toi d’avoir installé :

- ✅ Python 3.8 ou version supérieure  
- ✅ Node.js 16 ou version supérieure  
- ✅ [Playwright (Python)](https://playwright.dev/python/)  
- ✅ PostgreSQL (ou tu peux utiliser SQLite en développement)

---

## 🛠 Installation du projet

### 1. Cloner le dépôt GitHub

```bash
git clone https://github.com/Bilel-BenTaher/Web-Scraping-avec-Django-Angular.git
cd Web-Scraping-avec-Django-Angular
```

---

### 2. Installer le Backend (Django)

```bash
python -m venv venv
# Activation de l'environnement virtuel :
# Pour Windows :
venv\Scripts\activate
# Pour macOS/Linux :
source venv/bin/activate

# Installation des dépendances Python
pip install -r requirements.txt
```

---

### 3. Configurer les variables d’environnement

Crée un fichier `.env` dans le dossier `backend/` et ajoute :

```ini
DEBUG=True
SECRET_KEY=ta_clé_secrète
DATABASE_URL=sqlite:///db.sqlite3
# Si tu utilises PostgreSQL :
# DATABASE_URL=postgres://utilisateur:motdepasse@localhost:5432/nom_de_la_base
```

---

### 4. Appliquer les migrations

```bash
cd backend
python manage.py migrate
```

---

### 5. Installer le Frontend (Angular)

```bash
cd ../frontend
npm install
```

---

## 🚀 Lancer le projet

### 1. Scraper les citations

```bash
cd ../backend
python manage.py scrape_quotes
```

**Options disponibles :**
- `--headless=false` : permet d'afficher le navigateur pendant le scraping
- `--max-pages=5` : limite le nombre de pages à scraper

---

### 2. Lancer le serveur Django (API)

```bash
python manage.py runserver
```

📎 Accès à l’API : [http://localhost:8000/api/quotes/](http://localhost:8000/api/quotes/)

---

### 3. Lancer Angular (interface utilisateur)

```bash
cd ../frontend
ng serve
```

🌐 Interface Angular : [http://localhost:4200](http://localhost:4200)

---

## 🌟 Fonctionnalités principales

### 🔗 API REST Django

| Endpoint                        | Méthode | Description                    |
|--------------------------------|---------|--------------------------------|
| `/api/quotes/`                 | GET     | Liste paginée des citations   |
| `/api/quotes/?author=...`      | GET     | Filtrer par auteur            |
| `/api/quotes/?tag=...`         | GET     | Filtrer par tag               |

### 🖥️ Interface Angular

- Filtres dynamiques par auteur ou tag
- Pagination automatique
- Design responsive (Angular Material)
- Animations fluides et transitions

---

## 🧱 Arborescence du projet

```bash
scraping_project/
├── backend/
│   ├── manage.py
│   └── quotes/
│       ├── models.py
│       ├── scraper.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── admin.py
├── frontend/
│   └── src/app/
│       ├── quotes/
│       ├── api.service.ts
│       └── app.component.ts
├── requirements.txt
├── README.md
```

---

## 🧰 Technologies utilisées

| Couche       | Outils                          |
|--------------|----------------------------------|
| Backend      | Django 4, Django REST Framework, Playwright |
| Frontend     | Angular 14, Angular Material, TypeScript   |
| Base de données | SQLite (dev) / PostgreSQL (prod recommandé) |

---
