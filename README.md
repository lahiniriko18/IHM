# Projet IHM
# Gestion d'emploi du temps d'un etablissement de l'UF

Ce projet est une application web pour la gestion d'emploi du temps d'un etablissement de l'UF.
C'est une projet scolaire du matière IHM au niveau L3 au sein de l'Ecole Nationale d'Informatique
developpé en React pour le Frontend et Django pour le Backend.


# Structure du projet
IHM
    Backend
    Frontend
    .gitignore
    README.md


# Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Lahy00/IHM.git
cd IHM

cd Backend
python -m venv env
source env/bin/activate  # ou `env\Scripts\activate` sur Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

cd..
cd Frontend
npm install
npm run dev

### 2. Configuration et connexion de la base de données (toutes la configuration de la base est dans le dossier Backend)

# Création de la base de données

Créez la base de données dans MySQL :

```bash
CREATE DATABASE nom_de_la_base;

# Configuration de `settings.py`

Configurer votre `settings.py` dans le dossier principal du projet:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'nom_de_la_base',
        'USER': 'utilisateur',
        'PASSWORD': 'mot_de_passe', ## Faire '' s'il n'y a pas de mot de passe
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# Importation de la bibliothèque de la connexion

Importer cette bibliothèque de connexion au dessus de MIDDLEWARE dans le `settings.py`

```python
import pymysql
pymysql.install_as_MySQLdb()

Installer (si n'est pas installé)

```bash
pip install pymysql

### 3. Lancer le migration

# Exécutez les commandes suivantes :

```bash
python manage.py makemigrations
python manage.py migrate


### 2. Envoye d'une email

Configurer le 'settings.py'

```python
# settings.py

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'tonemail@gmail.com'  # Ton adresse Gmail
EMAIL_HOST_PASSWORD = 'motdepasse_app'  # Le mot de passe d'application 
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
