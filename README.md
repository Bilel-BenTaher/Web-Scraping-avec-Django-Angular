
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
```

#### Option 1 : Scraping manuel via l'interface Angular

Cette option permet de déclencher le scraping depuis l'interface utilisateur Angular.

1. Assurez-vous que **Redis** est installé sur votre machine.

2. Démarrez le service Redis :

   ```bash
   sudo service redis-server start
   ```

3. Vérifiez que Redis fonctionne correctement :

   ```bash
   redis-cli ping
   ```

   Vous devriez obtenir la réponse `PONG`.

4. Lancez un worker Celery pour exécuter les tâches de scraping :

   ```bash
   celery -A backend worker --loglevel=info --pool=solo
   ```

#### Option 2 : Scraping automatisé avec des tâches périodiques

Cette option permet d’exécuter le scraping à intervalles réguliers.

1. Lancez le scheduler Celery Beat :

   ```bash
   celery -A backend beat -l info
   ```

---

### 2. Lancer le serveur Django (API)

Dans un autre terminal, démarrez le serveur :

```bash
python manage.py runserver
```

📎 Accès à l’API : [http://localhost:8000/quotes/](http://localhost:8000/quotes/)

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

| Endpoint              | Méthode | Description                 |
| --------------------- | ------- | --------------------------- |
| `/quotes/`            | GET     | Liste paginée des citations |
| `/quotes/?author=...` | GET     | Filtrer par auteur          |
| `/quotes/?tag=...`    | GET     | Filtrer par tag             |

### 🖥️ Interface Angular

* Filtres dynamiques par auteur ou tag
* Pagination automatique
* Déclenchement manuel du scraping via l’interface

---

## 🧰 Technologies utilisées

| Couche          | Outils                                              |
| --------------- | --------------------------------------------------- |
| Backend         | Django 4, Django REST Framework, Celery, Playwright |
| Frontend        | Angular 14, TypeScript                              |
| Base de données | PostgreSQL                                          |
| Message Broker  | Redis                                               |

---
## **Vidéo de Présentation**

"Découvrez une démonstration du projet en vidéo. Cliquez sur 'Raw' pour la télécharger : [Voir la vidéo](video/video_quotes.mp4) 

---



