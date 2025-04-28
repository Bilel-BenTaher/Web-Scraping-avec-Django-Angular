<<<<<<< HEAD
# 📘 Projet Django + Angular - Scraping de citations

Ce projet permet de :
- Scraper des citations depuis [quotes.toscrape.com/js/](https://quotes.toscrape.com/js/)
- Stocker les données via une API Django REST

---

## 🔧 Installation rapide

### Backend (Django)

```bash
git clone https://github.com/Bilel-BenTaher/Web-Scraping-avec-Django-Angular.git
cd Web-Scraping-avec-Django-Angular
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
```

### Frontend (Angular)
=======
Parfait ! Voici le **fichier `README.md` complet** que tu peux copier-coller **directement** dans ton projet :

---

```markdown
# 🕸️ Projet Web Scraping avec Django & Angular

Application web permettant de **scraper des citations** depuis [Quotes to Scrape (JS)](https://quotes.toscrape.com/js/), de les **stocker via une API Django**, et de les **afficher dans une interface Angular** avec **filtres** et **pagination**.

---

## 📋 Prérequis

- Python 3.8+
- Node.js 16+
- [Playwright](https://playwright.dev/python/) (pour le scraping dynamique)
- PostgreSQL (optionnel, SQLite par défaut)

---

## 🛠 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/votre-repo.git
cd votre-repo
```

### 2. Installer le Backend (Django)

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### 3. Installer le Frontend (Angular)
>>>>>>> 3c655cf (Create README.md)

```bash
cd frontend
npm install
```

---

<<<<<<< HEAD
Appliquer les migrations :
=======
## ⚙ Configuration

### 🔐 Variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```ini
DEBUG=True
SECRET_KEY=votre_secret_key
DATABASE_URL=sqlite:///db.sqlite3
# Pour PostgreSQL : postgres://user:password@localhost:5432/nom_de_la_base
```

### 🗄️ Migrations Django
>>>>>>> 3c655cf (Create README.md)

```bash
python manage.py migrate
```

---

<<<<<<< HEAD
## 🚀 Lancement

### Scraper les données

```bash
python manage.py scrape_quotes
```

### Démarrer le backend
=======
## 🚀 Lancement du Projet

### 1. Scraper les citations

```bash
python quotes/scraper.py
```

Options utiles :
- `--headless=false` : Lance le navigateur en mode visible
- `--max-pages=5` : Limite le nombre de pages scrapées

### 2. Lancer le serveur Django
>>>>>>> 3c655cf (Create README.md)

```bash
python manage.py runserver
```

<<<<<<< HEAD
### Démarrer l’interface Angular
=======
API accessible sur : [http://localhost:8000/api/quotes/](http://localhost:8000/api/quotes/)

### 3. Démarrer Angular
>>>>>>> 3c655cf (Create README.md)

```bash
cd frontend
ng serve
```

<<<<<<< HEAD
---

## 🔗 Liens utiles

- API Django : [http://localhost:8000/api/quotes/](http://localhost:8000/api/quotes/)
- Interface Angular : [http://localhost:4200](http://localhost:4200)

---

## 🧱 Structure rapide

```
backend/
│   ├── quotes/ (scraper.py, models.py, views.py...)
frontend/
│   ├── src/app/quotes/ (composants Angular)
=======
Interface disponible sur : [http://localhost:4200](http://localhost:4200)

---

## 🌟 Fonctionnalités

### 📡 API REST

| Endpoint                        | Méthode | Description                    |
|---------------------------------|---------|--------------------------------|
| `/api/quotes/`                  | GET     | Liste paginée des citations   |
| `/api/quotes/?author=...`      | GET     | Filtrer par auteur            |
| `/api/quotes/?tag=...`         | GET     | Filtrer par tag               |

### 🖥️ Interface Angular

- 🔎 Filtres dynamiques par auteur ou tag
- 📄 Pagination automatique
- 🎨 Design responsive (Angular Material)
- ✨ Animations fluides

---

## 🧱 Structure du Projet

```
.
├── backend/
│   ├── manage.py
│   ├── quotes/
│   │   ├── models.py
│   │   ├── scraper.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   └── settings.py
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── quotes/
│   │       ├── api.service.ts
│   │       └── app.component.ts
├── requirements.txt
├── README.md
>>>>>>> 3c655cf (Create README.md)
```

---

<<<<<<< HEAD
## 🛠 Stack

- Django + DRF
- Playwright (scraping JS)
- Angular 
- SQLite 
---

=======
## 🐛 Dépannage

### Problèmes de scraping

- Vérifiez que le site source n'a pas changé son HTML
- Essayez en mode non-headless : `--headless=false`

### Erreurs CORS

Ajoutez ceci à `settings.py` :

```python
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')
CORS_ALLOW_ALL_ORIGINS = True  # En développement uniquement
```

---

## 📚 Stack Technique

- **Backend** : Django 4, Django REST Framework, Playwright
- **Frontend** : Angular 14, Angular Material, TypeScript
- **Base de données** : SQLite ou PostgreSQL

---

## 📄 Licence

Distribué sous licence **MIT** – voir le fichier [LICENSE](LICENSE) pour plus de détails.
```

---

Tu peux maintenant **copier/coller tout ce contenu** dans un fichier `README.md` à la racine de ton projet. Si tu veux que je t’aide à générer aussi le `requirements.txt`, le `.env`, ou d’autres fichiers comme `.gitignore`, fais-moi signe !
>>>>>>> 3c655cf (Create README.md)
