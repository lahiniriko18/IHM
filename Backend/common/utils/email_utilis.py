from django.core.mail import EmailMessage

class EnvoyerMail:
    def envoyerMail(self, sujet, message, destinataire, pj=None):
        email=EmailMessage(
            subject=sujet,
            body=message,
            to=[destinataire]
        )
        if pj:
            email.attach(pj.name, pj.read(), pj.content_type)
        email.send()