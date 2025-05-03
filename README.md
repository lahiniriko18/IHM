# Projet IHM

## Gestion d'emploi du temps d'un établissement de l'UF

Ce projet est une application web de gestion d'emploi du temps d'un établissement universitaire.  
Il a été réalisé dans le cadre de la matière IHM (Interface Homme-Machine) en L3 à l'École Nationale d'Informatique (ENI-Fianarantsoa).

- Frontend : React.js, Vite, Tailwind CSS
- Backend : Django, Django REST Framework, MySQL

---

## 📁 Structure du projet

```
IHM
├── Backend
├── Frontend
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Lahy00/IHM.git
cd IHM
```

### 2. Backend - Django

```bash
cd Backend
python -m venv env
env\Scripts\activate   # ou `source env/bin/activate` sur Linux/Mac
pip install -r requirements.txt

# Configuration de la base de données dans settings.py :
```

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'nom_de_la_base',
        'USER': 'utilisateur',
        'PASSWORD': 'mot_de_passe',  # '' si aucun mot de passe
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# Ajouter aussi
import pymysql
pymysql.install_as_MySQLdb()
```

Installer pymysql si besoin :

```bash
pip install pymysql
```

Puis exécuter :

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

---

## 📩 Configuration des emails (envoi de notifications)

Dans `Backend/settings.py` :

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'tonemail@gmail.com'
EMAIL_HOST_PASSWORD = 'motdepasse_app'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
```

---

## 🌐 Frontend - React + Vite + Tailwind CSS

```bash
cd ../Frontend
npm install
npm run dev
```

### 📁 Structure du dossier Frontend

```
Frontend
├── public
│   ├── Icons          # Contient les icônes PNG utilisés dans les composants
│   └── images         # (images éventuelles)
├── src
│   ├── Components
│   │   ├── ChildComponents
│   │   ├── Layout
│   │   └── Navbar&Header
│   ├── styles         # Fichiers SCSS ou CSS personnalisés
│   ├── App.jsx        # Composant racine
│   ├── index.css
│   └── main.jsx       # Point d'entrée Vite
├── tailwind.config.js
├── vite.config.js
└── package.json
```

### 🛠️ Technologies utilisées :

- **React.js** : bibliothèque pour construire l’interface utilisateur avec des composants.
- **Vite** : build tool rapide pour React.
- **Tailwind CSS** : framework CSS utilitaire pour un design responsive et moderne.
- **React Router** : pour la navigation entre les pages (si utilisé).
- **Gestion des images** : Les icônes sont placées dans `public/Icons` et accessibles via des chemins relatifs comme :

```jsx
<img src="/Icons/icons8-tableau-de-bord-24.png" />
```

### 🧩 Exemple de composant :

```jsx
function Navbar() {
  return (
    <nav className="w-52 h-screen fixed bg-white">
      <img src="/Icons/icons8-tableau-de-bord-24.png" />
      <span>Dashboard</span>
    </nav>
  );
}
```

---

## ✨ Fonctionnalités prévues

- Ajout/suppression de matières, enseignants, salles, horaires
- Affichage de l’emploi du temps par semaine
- Notifications par email
- Authentification des utilisateurs (étudiants, admins, etc.)
- Interface responsive

---

## 🧑‍💻 Équipe de développement

- **Avotra** – Développeur Frontend (React)
- **Alario** -Développeur Frontend (React)
- **Christian** – Développeur backend (Django Python)
- **Jeremia** -Développeur backend (Django Python)

---

---

## 📄 Licence

Ce projet est à but pédagogique, tous droits réservés à l'équipe de développement de l'ENI.
