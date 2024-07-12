docker-compose up -d

symfony console doctrine:database:create

symfony console doctrine:database:create --env=test

symfony console make:migration | symfony console m:m
symfony console doctrine:migrations:migrate | symfony console d:m:m
symfony console doctrine:migrations:migrate --env=test

vendor/bin/php-cs-fixer fix

vendor/bin/phpstan analyse

php bin/console security:hash-password
php bin/console cache:clear --env=prod
php bin/phpunit

commandes dans l'ordre :
php bin/console app:clean-simulations
php bin/console app:clean-anonymous-users

TODO CHANGER contact@your-domain.com
TODO CHANGER Contact // nom de l'adresse au dessus

TODO

make:auth Success!

- Finish the redirect "TODO" in the App\Security\UserLoginAuthenticator::onAuthenticationSuccess() method.

make:reset-password Success!

- Create a "forgot your password link" to the app_forgot_password_request route on your login form.

make:registration-form Success!

- In RegistrationController::verifyUserEmail():
  - Customize the last redirectToRoute() after a successful email verification.
  - Make sure you're rendering success flash messages or change the $this->addFlash() line.
