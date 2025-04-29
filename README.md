

---

# 📘 Projet Django + Angular – Scraping de citations

Application web permettant de **scraper des citations** depuis [Quotes to Scrape (JS)](https://quotes.toscrape.com/js/), de les **stocker dans une base de données via une API Django REST**, et de les **afficher dans une interface Angular** avec **filtres dynamiques** et **pagination**.

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

### 3. Appliquer les migrations

```bash
cd backend
python manage.py migrate
```

---

### 4. Installer le Frontend (Angular)

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

📎 Accès à l’API : [http://localhost:8000/api/quotes/](http://localhost:8000/quotes/)

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
---

## 🧰 Technologies utilisées

| Couche       | Outils                          |
|--------------|----------------------------------|
| Backend      | Django 4, Django REST Framework, Playwright |
| Frontend     | Angular 14, Angular Material, TypeScript   |
| Base de données |  PostgreSQL  |

---
