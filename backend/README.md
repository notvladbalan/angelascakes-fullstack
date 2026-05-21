# Angela's Cakes API

REST API backend pro online cukrárnu s možností správy dortů, příchutí a dekorací.

## Technologie

- Java 17
- Spring Boot 3.5.14
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL
- Swagger / OpenAPI
- JUnit 5 + Mockito

## Spuštění projektu

### Požadavky
- Java 17+
- MySQL (např. WAMP)
- IntelliJ IDEA

### Kroky

1. Klonuj repozitář:
   git clone <url repozitáře>

2. Vytvoř databázi v phpMyAdmin:
   název: angelascakes

3. Nastav environment variables v IntelliJ
   (Edit Configurations → Environment variables):
   DB_USERNAME=root
   DB_PASSWORD=tvoje_heslo
   JWT_SECRET=tvuj_jwt_secret

4. Spusť aplikaci přes IntelliJ

5. Aplikace běží na:
   http://localhost:8080

## API Dokumentace

Po spuštění aplikace dostupná na:
http://localhost:8080/swagger-ui.html

## Architektura

Aplikace je postavena na vícevrstvé architektuře:

- **Entity** - datové objekty (User, Cake, Flavor, Decoration)
- **Repository** - přístup k databázi (Spring Data JPA)
- **Service** - business logika
- **Controller** - REST endpointy
- **DTO** - přenos dat mezi vrstvami
- **Security** - JWT autentizace, role-based autorizace

## Bezpečnost

- Autentizace pomocí JWT tokenů
- Dvě uživatelské role: ADMIN a CUSTOMER
- Výchozí admin účet: admin@angelascakes.com / admin123

## Endpointy

### Auth (veřejné)
| Metoda | URL | Popis |
|--------|-----|-------|
| POST | /api/auth/register | Registrace nového uživatele |
| POST | /api/auth/login | Přihlášení, vrátí JWT token |

### Dorty
| Metoda | URL | Popis | Role |
|--------|-----|-------|------|
| GET | /api/cakes | Seznam všech dortů (+ filtrování, stránkování) | Všichni |
| GET | /api/cakes/{id} | Detail dortu | Všichni |
| POST | /api/cakes | Vytvoření dortu | ADMIN |
| PUT | /api/cakes/{id} | Úprava dortu | ADMIN |
| DELETE | /api/cakes/{id} | Smazání dortu | ADMIN |

### Příchutě
| Metoda | URL | Popis | Role |
|--------|-----|-------|------|
| GET | /api/flavors | Seznam příchutí | Všichni |
| POST | /api/flavors | Vytvoření příchuti | ADMIN |
| DELETE | /api/flavors/{id} | Smazání příchuti | ADMIN |

### Dekorace
| Metoda | URL | Popis | Role |
|--------|-----|-------|------|
| GET | /api/decorations | Seznam dekorací | Všichni |
| POST | /api/decorations | Vytvoření dekorace | ADMIN |
| DELETE | /api/decorations/{id} | Smazání dekorace | ADMIN |

### Monitoring
| URL | Popis |
|-----|-------|
| /actuator/health | Stav aplikace |
| /actuator/metrics | Metriky |
| /actuator/info | Informace o aplikaci |

## Testování

Spuštění testů v IntelliJ:
- Pravý klik na složku test → Run All Tests

Nebo přes Maven:
mvn test

Testy pokrývají kompletní Cake větev:
- CakeServiceTest - jednotkové testy business logiky
- AngelascakesApplicationTests - test spuštění kontextu