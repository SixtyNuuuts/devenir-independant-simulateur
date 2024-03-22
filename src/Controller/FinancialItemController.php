<?php

namespace App\Controller;

use App\Entity\FinancialItem;
use App\Form\FinancialItemType;
use App\Repository\FinancialItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/financial/item')]
class FinancialItemController extends AbstractController
{
    #[Route('/', name: 'app_financial_item_index', methods: ['GET'])]
    public function index(FinancialItemRepository $financialItemRepository): Response
    {
        return $this->render('financial_item/index.html.twig', [
            'financial_items' => $financialItemRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_financial_item_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $financialItem = new FinancialItem();
        $form          = $this->createForm(FinancialItemType::class, $financialItem);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($financialItem);
            $entityManager->flush();

            return $this->redirectToRoute('app_financial_item_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('financial_item/new.html.twig', [
            'financial_item' => $financialItem,
            'form'           => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_financial_item_show', methods: ['GET'])]
    public function show(FinancialItem $financialItem): Response
    {
        return $this->render('financial_item/show.html.twig', [
            'financial_item' => $financialItem,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_financial_item_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, FinancialItem $financialItem, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(FinancialItemType::class, $financialItem);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_financial_item_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('financial_item/edit.html.twig', [
            'financial_item' => $financialItem,
            'form'           => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_financial_item_delete', methods: ['POST'])]
    public function delete(Request $request, FinancialItem $financialItem, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$financialItem->getId(), $request->request->get('_token'))) {
            $entityManager->remove($financialItem);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_financial_item_index', [], Response::HTTP_SEE_OTHER);
    }
}
