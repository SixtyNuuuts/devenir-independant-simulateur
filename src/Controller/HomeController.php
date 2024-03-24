<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\AnonymousUser;
use App\Security\UserService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
    private User|AnonymousUser $user;

    public function __construct(
        private UserService $userService,
    ) {
        $this->user = $this->userService->getCurrentUser();
    }

    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        dd($this->user);

        return $this->render('home/index.html.twig');
    }
}
