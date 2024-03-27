<?php

namespace App\Controller\Admin\Crud;

use App\Entity\Activity;
use App\Form\ActivityType;
use App\Repository\ActivityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/crud/activity')]
class ActivityController extends AbstractController
{
    #[Route('/', name: 'app_admin_crud_activity_index', methods: ['GET'])]
    public function index(ActivityRepository $activityRepository): Response
    {
        return $this->render('admin/crud/activity/index.html.twig', [
            'activities' => $activityRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_admin_crud_activity_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $activity = new Activity();
        $form     = $this->createForm(ActivityType::class, $activity);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($activity);
            $entityManager->flush();

            return $this->redirectToRoute('app_admin_crud_activity_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('admin/crud/activity/new.html.twig', [
            'activity' => $activity,
            'form'     => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_admin_crud_activity_show', methods: ['GET'])]
    public function show(Activity $activity): Response
    {
        return $this->render('admin/crud/activity/show.html.twig', [
            'activity' => $activity,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_admin_crud_activity_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Activity $activity, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(ActivityType::class, $activity);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_admin_crud_activity_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('admin/crud/activity/edit.html.twig', [
            'activity' => $activity,
            'form'     => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_admin_crud_activity_delete', methods: ['POST'])]
    public function delete(Request $request, Activity $activity, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$activity->getId(), (string) $request->request->get('_token'))) {
            $entityManager->remove($activity);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_admin_crud_activity_index', [], Response::HTTP_SEE_OTHER);
    }
}
