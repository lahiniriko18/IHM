from datetime import datetime, timedelta


def get_semaine_by_date(dateStr, day):
    date = datetime.strptime(dateStr, "%d-%m-%Y")
    lundi = date - timedelta(date.weekday())
    dernier = lundi + timedelta(days=day)
    return [lundi, dernier]
