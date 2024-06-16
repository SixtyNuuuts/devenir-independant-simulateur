<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/image')]
class ImageUploadController extends AbstractController
{
    private string $targetDirectory;

    public function __construct(string $targetDirectory)
    {
        $this->targetDirectory = $targetDirectory;
    }

    #[IsGranted('ROLE_ADMIN')]
    #[Route('/upload', name: 'app_image_upload', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        $type = $request->request->get('type');
        $name = $request->request->get('name');

        if (!$file || !$file instanceof UploadedFile) {
            return $this->json(['error' => 'No file provided or invalid file'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (!in_array($type, ['mobileImage', 'desktopImage'], true)) {
            return $this->json(['error' => 'Invalid image type'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $fileName = $this->generateUniqueFileName($name, $file->guessExtension());

        try {
            $file->move($this->getTargetDirectory(), $fileName);
        } catch (FileException $exception) {
            return $this->json(['error' => 'Failed to upload image: ' . $exception->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        $fileUrl = '/uploads/' . $fileName; // Assuming the uploads directory is publicly accessible

        return $this->json(['url' => $fileUrl], JsonResponse::HTTP_OK);
    }

    private function generateUniqueFileName(string $name, string $extension): string
    {
        $baseName = $name;

        $counter = 1;
        $fileName = $baseName . '.' . $extension;
        while (file_exists($this->getTargetDirectory() . '/' . $fileName)) {
            $fileName = $baseName . '-' . $counter . '.' . $extension;
            $counter++;
        }

        return $fileName;
    }

    private function getTargetDirectory(): string
    {
        return $this->targetDirectory;
    }
}
