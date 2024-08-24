<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\AnonymousUser;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;

class UserService
{
	public function __construct(
		private Security $security,
		private EntityManagerInterface $entityManager,
		private RequestStack $requestStack,
	) {}

	public function getCurrentUser(): User|AnonymousUser
	{
		$user = $this->security->getUser();

		if ($user instanceof User) {
			return $user;
		}

		$session = $this->requestStack->getSession();
		$sessionId = $session->getId();
		$clientIp = $this->requestStack->getCurrentRequest()->getClientIp();

		// Récupérer le nombre d'anonymousUser créés par cette IP dans un intervalle de temps
		$anonymousUserCount = $this->entityManager->getRepository(AnonymousUser::class)->countByIp($clientIp, new \DateTime('-24 hours'));

		// Limiter le nombre de créations par IP
		if ($anonymousUserCount > 5) { // Limite à ajuster selon votre besoin
			throw new \Exception('Trop de simulations créées, veuillez réessayer plus tard.');
		}

		if (!$sessionId) {
			$session->set('anonymous_user_id', 'init');
			$sessionId = $session->getId();
		}

		$anonymousUser = $this->entityManager->getRepository(AnonymousUser::class)->findOneBy(['sessionId' => $sessionId]);

		if (!$anonymousUser) {
			$anonymousUser = new AnonymousUser();
			$anonymousUser->setSessionId($sessionId);
			$anonymousUser->setIpAddress($clientIp); // Enregistrer l'adresse IP

			$this->entityManager->persist($anonymousUser);
			$this->entityManager->flush();

			$session->set('anonymous_user_id', $anonymousUser->getId());
		}

		return $anonymousUser;
	}
}
