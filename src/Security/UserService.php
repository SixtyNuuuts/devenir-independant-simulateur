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
	) {
	}

	public function getCurrentUser(): User|AnonymousUser
	{
		$user = $this->security->getUser();

		// user is authenticated
		if ($user instanceof User) {
			return $user;
		}

		// else use the session to create or retrieve an anonymousUser
		$session = $this->requestStack->getSession();

		$sessionId = $session->getId();
		if (!$sessionId) {
			$session->set('anonymous_user_id', 'init');
			$sessionId = $session->getId();
		}

		$anonymousUser = $this->entityManager->getRepository(AnonymousUser::class)->findOneBy(['sessionId' => $sessionId]);

		if (!$anonymousUser) {
			$anonymousUser = new AnonymousUser();
			$anonymousUser->setSessionId($sessionId);

			$this->entityManager->persist($anonymousUser);
			$this->entityManager->flush();

			$session->set('anonymous_user_id', $anonymousUser->getId());
		}

		return $anonymousUser;
	}
}
