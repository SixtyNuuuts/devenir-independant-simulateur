<?php

namespace App\Controller;

use App\Entity\Simulation;
use App\Form\SimulationType;
use App\Repository\SimulationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/simulation')]
class SimulationController extends AbstractController
{
    #[Route('/', name: 'app_simulation_index', methods: ['GET'])]
    public function index(SimulationRepository $simulationRepository): Response
    {
        return $this->render('simulation/index.html.twig', [
            'simulations' => $simulationRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_simulation_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $simulation = new Simulation();
        $form       = $this->createForm(SimulationType::class, $simulation);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($simulation);
            $entityManager->flush();

            return $this->redirectToRoute('app_simulation_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('simulation/new.html.twig', [
            'simulation' => $simulation,
            'form'       => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_simulation_show', methods: ['GET'])]
    public function show(Simulation $simulation): Response
    {
        return $this->render('simulation/show.html.twig', [
            'simulation' => $simulation,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_simulation_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Simulation $simulation, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(SimulationType::class, $simulation);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_simulation_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('simulation/edit.html.twig', [
            'simulation' => $simulation,
            'form'       => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_simulation_delete', methods: ['POST'])]
    public function delete(Request $request, Simulation $simulation, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$simulation->getId(), $request->request->get('_token'))) {
            $entityManager->remove($simulation);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_simulation_index', [], Response::HTTP_SEE_OTHER);
    }
}
