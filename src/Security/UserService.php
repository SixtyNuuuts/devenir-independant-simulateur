<?php

namespace App\Security;

use App\Entity\Activity;
use App\Entity\AnonymousUser;
use App\Entity\Simulation;
use App\Entity\User;
use App\Repository\SimulationRepository;
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

    public function getCurrentUserType(): string
    {
        $user = $this->getCurrentUser();

        return $user instanceof User ? 'user' : 'anonymous';
    }

    public function getActivitySimulationByCurrentUserOrDefault(Activity $activity, SimulationRepository $simulationRepository): ?Simulation
    {
        $user     = $this->getCurrentUser();
        $userType = $this->getCurrentUserType();

        $criteria = ['activity' => $activity];
        if ('user' === $userType) {
            $criteria['user'] = $user;
        } else {
            $criteria['anonymousUser'] = $user;
        }

        $simulation = $simulationRepository->findOneBy($criteria, ['createdAt' => 'DESC']);

        if (!$simulation) {
            $simulation = $simulationRepository->findOneBy(['activity' => $activity, 'token' => 'default']);
        }

        return $simulation;
    }

    // public function createNewSimulationForCurrentUser(Activity $activity, array $defaultSimulationFinancialItems): Simulation
    // {
    //     $user = $this->getCurrentUser();

    //     $simulation = new Simulation();
    //     $simulation->setActivity($activity);

    //     if ($user instanceof User) {
    //         $simulation->setUser($user);
    //     } elseif ($user instanceof AnonymousUser) {
    //         $simulation->setAnonymousUser($user);
    //     }

    //     foreach ($defaultSimulationFinancialItems as $financialItem) {
    //         $newFinancialItem = clone $financialItem;
    //         $this->entityManager->persist($newFinancialItem);
    //         $simulation->addFinancialItem($newFinancialItem);
    //     }

    //     $this->entityManager->persist($simulation);
    //     $this->entityManager->flush();

    //     return $simulation;
    // }
}
