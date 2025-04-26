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

```bash
cd frontend
npm install
```

---

Appliquer les migrations :

```bash
python manage.py migrate
```

---

## 🚀 Lancement

### Scraper les données

```bash
python manage.py scrape_quotes
```

### Démarrer le backend

```bash
python manage.py runserver
```

### Démarrer l’interface Angular

```bash
cd frontend
ng serve
```

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
```

---

## 🛠 Stack

- Django + DRF
- Playwright (scraping JS)
- Angular 
- SQLite 
---

