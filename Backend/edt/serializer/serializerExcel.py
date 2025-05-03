from rest_framework import serializers
from datetime import datetime, timedelta,time
from ..models import Classe,Parcours,Groupe,Posseder,Matiere,Professeur,Enseigner,Salle
from django.db.models import Q
class ExcelSerializer(serializers.Serializer):
    fichier=serializers.FileField()


class TitreSerializer(serializers.Serializer):
    Titre=serializers.CharField()

class ContenuSerializer(serializers.Serializer):
    Horaire=serializers.CharField()
    Lundi=serializers.ListField(child=serializers.CharField())
    Mardi=serializers.ListField(child=serializers.CharField())
    Mercredi=serializers.ListField(child=serializers.CharField())
    Jeudi=serializers.ListField(child=serializers.CharField())
    Vendredi=serializers.ListField(child=serializers.CharField())
    Samedi=serializers.ListField(child=serializers.CharField())

    def messageErreur(self,erreur):
        index = self.context.get("index")
        if index is not None:
            raise serializers.ValidationError({
                "texte":f"Colonne: Horaire, ligne: {index+1}. {erreur.get("texte")}",
                "aide":erreur.get("aide","Rien")
                })
        raise serializers.ValidationError(erreur)
    def messageErreurSemaine(self,erreur,colonne,case=None):
        index = self.context.get("index")
        if index is not None:
            return {
                "texte":f"Colonne: {colonne},{ f' case: {case},' if case is not None else ''} ligne: {index+1}. {erreur.get("texte")}",
                "aide":erreur.get("aide","Rien")
            }
        return {
                "texte":f"Colonne: {colonne}. {erreur.get("texte")}",
                "aide":erreur.get("aide","Rien")
            }
    
    def validate_Horaire(self, value):
        
        value=value.strip().lower()
        if "-" not in value:
            self.messageErreur({
                    "texte":"Format invalide !",
                    "aide":"Format: 8h-10h (8h30 s'il y a du minute) !"
                })
        horaire=value.lower().split("-")
        if len(horaire) != 2:
            self.messageErreur({
                    "texte":"Format invalide !",
                    "aide":"Format: 8h-10h (8h30 s'il y a du minute) !"
                })
        if any("h" not in i for i in horaire):
            self.messageErreur({
                    "texte":"Format invalide !",
                    "aide":"Format: 8h-10h (8h30 s'il y a du minute) !"
                })
        if any(i.count("h") != 1 for i in horaire):
            self.messageErreur({
                    "texte":"Format invalide !",
                    "aide":"Format: 8h-10h (8h30 s'il y a du minute) !"
                })

        dHeure,dMin = horaire[0].split("h")
        fHeure,fMin = horaire[1].split("h")
        if len(dMin) == 0:dMin="00"
        if len(fMin) == 0:fMin="00"

        if any(not i.isdigit() for i in [dHeure,dMin,fHeure,fMin]):
            self.messageErreur({
                    "texte":"L'heure et minute sont tous en nombres !",
                    "aide":"Format: 8h-10h (8h30 s'il y a du minute) !"
                })
        if any(int(i)>23 for i in [dHeure,fHeure]):
            self.messageErreur({
                    "texte":"L'heure ne doit être supérieur à 23 !"
                })
        if any(int(i)>59 for i in [dMin,fMin]):
            self.messageErreur({
                    "texte":"Le minute ne doit être supérieur à 59 !"
                })
            
        heureDebut=time(int(dHeure),int(dMin))
        heureFin=time(int(fHeure),int(fMin))

        if heureDebut >= heureFin:
            self.messageErreur({
                    "texte":"L'heure de début ne doit pas supérieur ou égale à l'heure de fin !",
                    "aide":"Format: 8h-10h (8h30 s'il y a du minute) !"
                })

        return {
            "heureDebut":heureDebut,
            "heureFin":heureFin
        }
    
    def validate(self, data):
        erreurs= {}
        semaine = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
        donnee = {
            "Horaire":data["Horaire"]
        }
        dSexe = {
            "mr":"Masculin",
            "mme":"Féminin"
        }
        for jour in semaine:
            valeurs = data.get(jour, [])
            valideValeur=[]
            erreur = []
            if len(valeurs) != 2:
                print(len(valeurs))
                erreurs[jour]=self.messageErreurSemaine(
                        {
                        "texte":"Le nombre de colonne ne doit pas différent de 2 !"
                        },
                        jour
                    )
                continue
            for i,valeur in enumerate(valeurs):
                if valeur == "vide":
                    valideValeur.append([])
                    continue
                valeur = [j.lower().strip() for j in valeur.split("\n")]
                caseContenu = {}
                if len(valeur) != 4:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Chaque colonne n'est pas vide doit contenir 4 lignes d'information"
                        },jour,i+1)
                    )
                    continue

                ##### Traitement du matière #####
                if len(valeur[0].split()) != 2:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Le premier ligne doit contenir le parcours et groupe separé par espace !"
                        },jour,i+1)
                    )
                    continue
                parcours, groupeStr=valeur[0].split()
                codeGroupe = None
                for code in ["g","grp","groupe"]:
                    if code in groupeStr:codeGroupe=code

                if codeGroupe is None:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Format du groupe invalide !",
                            "aide":"Format: grp1 ou g1 ou groupe1"
                        },jour,i+1)
                    )
                    continue
                groupeNum=groupeStr.replace(codeGroupe,'')
                if not groupeNum.isdigit():
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Format du groupe invalide !",
                            "aide":"Format: grp1 ou g1 ou groupe1"
                        },jour,i+1)
                    )
                    continue
                groupe = Groupe.objects.filter(nomGroupe=f"Groupe {groupeNum}").first()
                if not groupe:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Groupe introuvable !",
                        },jour,i+1)
                    )
                    continue
                posseder = Posseder.objects.filter(numGroupe=groupe.numGroupe).first()
                if not posseder:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Ce classe ne possède pas ce groupe !",
                        },jour,i+1)
                    )
                    continue
                caseContenu["groupe"]=groupe.numGroupe

                ##### Traitement du matière #####
                matiereStr = valeur[1]
                matiere = Matiere.objects.filter(Q(nomMatiere=matiereStr) | Q(codeMatiere=matiereStr)).first()
                if not matiere:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Cette matière n'existe pas !",
                        },jour,i+1)
                    )
                    continue
                caseContenu["matiere"]=matiere.numMatiere

                ##### Traitement du professeur #####
                professeurStr = [v.strip() for v in valeur[2].split()]
                if len(professeurStr) != 2:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Format du nom de professeur invalide !",
                            "aide":"Format: Mr ou Mme avec son nom séparé par espace."
                        },jour,i+1)
                    )
                    continue
                sexeStr,nomProf=professeurStr
                if sexeStr not in list(dSexe.keys()):
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Format du nom de professeur invalide !",
                            "aide":"Format: Mr ou Mme avec son nom séparé par espace."
                        },jour,i+1)
                    )
                    continue
                professeurs= Professeur.objects.filter(nomCourant = nomProf, sexe=dSexe.get(sexeStr)).values()
                if len(list(professeurs)) == 0:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Professeur introuvable !",
                            "aide":"Veuillez insérez ce professeur avant de l'ajouter dans le fichier Excel"
                        },jour,i+1)
                    )
                    continue
                professeur = None
                for prof in list(professeurs):
                    enseigner= Enseigner.objects.filter(numProfesseur=prof.numProfesseur, numMatiere=matiere.numMatiere).first()
                    if enseigner:professeur=prof
                if professeur is None:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Professeur ne correspond pas au matière",
                            "aide":"Le professeur doit enseigner le matière dans le même cellule."
                        },jour,i+1)
                    )
                    continue
                caseContenu["professeur"]=professeur.numProfesseur
                
                #### Traitement salle #####
                salleStr = [v.strip() for v in valeur[3].split()]
                if len(salleStr) != 2:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Format du salle invalide !",
                            "aide":"Format: S ou Salle et numéro du salle séparé par espace."
                        },jour,i+1)
                    )
                    continue
                codeSalle, numeroSalle = salleStr
                if codeSalle not in ["s","salle"]:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Format du salle invalide !",
                            "aide":"Format: S ou Salle et numéro du salle séparé par espace."
                        },jour,i+1)
                    )
                    continue
                salle = Salle.objects.filter(nomSalle=f"Salle {numeroSalle}").first()
                if not salle:
                    erreur.append(
                        self.messageErreurSemaine({
                            "texte":"Ce salle n'existe pas !",
                            "aide":"Veuillez ajouter ce salle avant de le saisir dans le fichier."
                        },jour,i+1)
                    )
                    continue
                caseContenu["salle"]=salle.numSalle

                if not erreur:
                    valideValeur.append(caseContenu)
            if not erreur:
                donnee[jour]=valideValeur
            else:
                erreurs[jour]=erreur
        if erreurs:
            raise serializers.ValidationError(erreurs)

        return donnee
    
class DataSerializer(serializers.Serializer):
    titre=serializers.ListField(child=TitreSerializer())
    contenu=serializers.ListField()
    
    def validate_titre(self, value):
        titre=[]
        def messageErreur(erreur):
            raise serializers.ValidationError({"erreur":erreur})

        jours = ["lundi","mardi","mercredi","jeudi","vendredi","samedi"]
        mois={"janvier":1,
              "février":2,
              "mars":3,
              "avril":4,
              "mai":5,
              "juin":6,
              "juillet":7,
              "aôut":8,
              "septembre":9,
              "octobre":10,
              "novembre":11,
              "décembre":12
              }
        
        def formaterEspace(valeur):
            valeur= [i.strip() for i in valeur.split()]
            return " ".join(valeur)
        if len(value) < 2:
            messageErreur("Il doit avoir au moins deus titres !")
        titre1  =formaterEspace(value[0]["Titre"])
        titre2 = formaterEspace(value[1]["Titre"]).lower()

        titre1Split=titre1.split()
        if len(titre1Split) not in (9,10):
            messageErreur("Erreur de format de premier tire: Emploi du temps du 01 au 05 Avril 2025")
        if " ".join(titre1Split[0:4]) != "Emploi du temps du":
            messageErreur("Erreur de format de premier tire: Emploi du temps du 01 au 05 Avril 2025")

        semaine=" ".join(titre1Split[4::])
        if "au" not in semaine:
            messageErreur("Erreur de format de premier tire: Emploi du temps du 01 au 05 Avril 2025")
        semaineSplit=semaine.split("au")
        if len(semaineSplit) != 2:
            messageErreur("Erreur de format de premier tire: Emploi du temps du 01 au 05 Avril 2025")
        
        debut, fin = map(str.lower,semaineSplit)
        
        debutSplit=debut.split()
        finSplit=fin.split()

        if len(debutSplit) > 2 or len(debutSplit) == 0:
            messageErreur("Erreur de format de premier tire: Emploi du temps du 01 au 05 Avril 2025")
        if not debutSplit[0].isdigit():
            messageErreur("Erreur de format de premier tire: Emploi du temps du 01 au 05 Avril 2025")

        jourDebut=int(debutSplit[0])
        moisDebut = None
        if len(debutSplit) > 1:
            moisDebut=debutSplit[1]
        
        if len(finSplit) != 3:
            messageErreur("Erreur de format de premier tire: Emploi du temps du 01 au 05 Avril 2025")
        if not finSplit[0].isdigit() or not finSplit[2].isdigit():
            messageErreur("Erreur de format de premier tire: Emploi du temps du 01 au 05 Avril 2025")

        jourFin=int(finSplit[0])
        moisFin= finSplit[1].lower()
        annee=int(finSplit[2])
        
        if moisDebut is None:
            moisDebut = moisFin
        moisDebutNum=mois.get(moisDebut)
        moisFinNum=mois.get(moisFin)

        if moisDebutNum is None or moisFinNum is None:
            messageErreur("Mois invalide !")
        dateDebut = datetime(annee,moisDebutNum,jourDebut)
        dates={}
        for i,jour in enumerate(jours):
            dateCourante= dateDebut + timedelta(days=i)
            dates[jour]=dateCourante.strftime("%d-%m-%Y")

        titre.append(dates)

        titre2Split=titre2.split()
        if len(titre2Split) != 2:
            messageErreur("Erreur de format de niveau et de parcours. Format: L1 IG")

        niveauTitre, parcoursTitre=titre2Split

        classe = Classe.objects.filter(niveau=niveauTitre.upper()).first()
        parcours = Parcours.objects.filter(Q(nomParcours=parcoursTitre) | Q(codeParcours=parcoursTitre)).first()
        if not classe:
            messageErreur("Niveau introuvable !")
        if not parcours:
            messageErreur("Parcours introuvable !")
        
        niveauParcours = {
            "niveau":classe.numClasse,
            "parcours":parcours.numParcours
        }
        titre.append(niveauParcours)
        
        return titre

    def validate_contenu(self, value):
        erreurs = []
        contenuValide = []

        for i, ligne in enumerate(value):
            serializer= ContenuSerializer(data=ligne, context={'index': i})
            if serializer.is_valid():
                contenuValide.append(serializer.validated_data)
            else:
                erreurs.append(serializer.errors)
                raise serializers.ValidationError(erreurs)
        
        if erreurs:
            raise serializers.ValidationError(erreurs)
        
        return contenuValide