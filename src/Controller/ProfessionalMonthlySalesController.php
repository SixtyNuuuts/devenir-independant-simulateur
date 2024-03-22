<?php

namespace App\Controller;

use App\Entity\ProfessionalMonthlySales;
use App\Form\ProfessionalMonthlySalesType;
use App\Repository\ProfessionalMonthlySalesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/professional/monthly/sales')]
class ProfessionalMonthlySalesController extends AbstractController
{
    #[Route('/', name: 'app_professional_monthly_sales_index', methods: ['GET'])]
    public function index(ProfessionalMonthlySalesRepository $professionalMonthlySalesRepository): Response
    {
        return $this->render('professional_monthly_sales/index.html.twig', [
            'professional_monthly_sales' => $professionalMonthlySalesRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_professional_monthly_sales_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $professionalMonthlySale = new ProfessionalMonthlySales();
        $form                    = $this->createForm(ProfessionalMonthlySalesType::class, $professionalMonthlySale);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($professionalMonthlySale);
            $entityManager->flush();

            return $this->redirectToRoute('app_professional_monthly_sales_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('professional_monthly_sales/new.html.twig', [
            'professional_monthly_sale' => $professionalMonthlySale,
            'form'                      => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_professional_monthly_sales_show', methods: ['GET'])]
    public function show(ProfessionalMonthlySales $professionalMonthlySale): Response
    {
        return $this->render('professional_monthly_sales/show.html.twig', [
            'professional_monthly_sale' => $professionalMonthlySale,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_professional_monthly_sales_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, ProfessionalMonthlySales $professionalMonthlySale, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ProfessionalMonthlySalesType::class, $professionalMonthlySale);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_professional_monthly_sales_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('professional_monthly_sales/edit.html.twig', [
            'professional_monthly_sale' => $professionalMonthlySale,
            'form'                      => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_professional_monthly_sales_delete', methods: ['POST'])]
    public function delete(Request $request, ProfessionalMonthlySales $professionalMonthlySale, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$professionalMonthlySale->getId(), $request->request->get('_token'))) {
            $entityManager->remove($professionalMonthlySale);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_professional_monthly_sales_index', [], Response::HTTP_SEE_OTHER);
    }
}
