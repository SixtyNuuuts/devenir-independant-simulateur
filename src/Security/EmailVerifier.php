<?php

declare(strict_types=1);

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use SymfonyCasts\Bundle\VerifyEmail\VerifyEmailHelperInterface;

class EmailVerifier
{
	public function __construct(
		private VerifyEmailHelperInterface $verifyEmailHelper,
		private MailerInterface $mailer,
		private EntityManagerInterface $entityManager,
	) {
	}

	public function sendEmailConfirmation(string $verifyEmailRouteName, UserInterface $user, TemplatedEmail $email): void
	{
		/** @var User $user */
		$user = $user;
		$userId = $user->getId();
		$userEmail = $user->getEmail();

		if (empty($userId)) {
			throw new BadRequestHttpException("L'ID de l'utilisateur ne peut pas être null.");
		}

		if (empty($userEmail)) {
			throw new BadRequestHttpException('Email de l\'utilisateur manquant ou invalide.');
		}

		$signatureComponents = $this->verifyEmailHelper->generateSignature(
			$verifyEmailRouteName,
			(string) $userId,
			$userEmail,
			['id' => $userId],
		);

		$context = $email->getContext();
		$context['signedUrl'] = $signatureComponents->getSignedUrl();
		$context['expiresAtMessageKey'] = $signatureComponents->getExpirationMessageKey();
		$context['expiresAtMessageData'] = $signatureComponents->getExpirationMessageData();

		$email->context($context);

		$this->mailer->send($email);
	}

	/**
	 * @throws VerifyEmailExceptionInterface
	 */
	public function handleEmailConfirmation(Request $request, UserInterface $user): void
	{
		/** @var User $user */
		$user = $user;
		$userId = $user->getId();
		$userEmail = $user->getEmail();

		if (empty($userId)) {
			throw new BadRequestHttpException("L'ID de l'utilisateur ne peut pas être null.");
		}

		if (empty($userEmail)) {
			throw new BadRequestHttpException('Email de l\'utilisateur manquant ou invalide.');
		}

		$this->verifyEmailHelper->validateEmailConfirmationFromRequest($request, (string) $userId, $userEmail);

		$user->setIsVerified(true);

		$this->entityManager->persist($user);
		$this->entityManager->flush();
	}
}
