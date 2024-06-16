<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LegalController extends AbstractController
{
    #[Route('/mentions-legales', name: 'app_legal_notices', methods: ['GET'])]
    public function legalNotices(): Response
    {
        return $this->render('legal/legal_notices.html.twig');
    }

    #[Route('/protection-des-donnees-personnelles', name: 'app_protection_of_personal_data', methods: ['GET'])]
    public function protectionOfPersonalData(): Response
    {
        return $this->render('legal/protection_of_personal_data.html.twig');
    }
}
