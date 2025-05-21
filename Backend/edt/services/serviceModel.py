from rest_framework import status

class ServiceModelCrud:
    def __init__(self, model):
        self.model = model
    
    def suppressionMutlipe(self, data, nomIds, nomTable):

        ids=data.get(nomIds,[])
        if not isinstance(ids, list):
            ids=data.getlist(f'{nomIds}[]')

        if any(isinstance(id, str) for id in ids):
            return {
                "context":{"erreur":"Type de données invalide !"},
                "status":status.HTTP_401_UNAUTHORIZED
            }

        tables=self.model.objects.filter(pk__in=ids)
        if tables:
            for table in tables:
                table.delete()
            return {
                "context":"Suppression avec succès !",
                "status":status.HTTP_200_OK
            }
        return {
            "context":{"erreur":f"{nomTable} introuvables !"},
            "status":status.HTTP_404_NOT_FOUND
        }