# TODO

## Feature tasks

- Lag edit wine skjema. Da egen route med egen page. Lag skjemaet ganske likt som add wine skjemaet, og hent inn eksisterende data i skjemaet. Evt sjekk i apiet om det er en getbyid som man kan bruke for å hente inn eksisterende data. Husk oppdater edit knappen til å navigere til edit wine route med riktig id. Denne knappen er på wine details siden.
- Delete wine. Lag en egen delete modal som blir åpnet av en delete knapp på wine details siden. Knappen og modalen kan kanskje trekkes ut i en egen komponent. Bruk html dialog element for modalen. Modal skal bare spørre brukeren om man vil slette vinen. Husk å navigere tilbake til home page etter en delete. Dobbelt sjekk wine-controller i apiet for å se om det er en delete by id funksjon der.