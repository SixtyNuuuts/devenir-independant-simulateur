<?php

namespace App\Entity;

use App\Repository\AnonymousUserRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnonymousUserRepository::class)]
class AnonymousUser
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'bigint')]
    private ?string $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $sessionId = null;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getSessionId(): ?string
    {
        return $this->sessionId;
    }

    public function setSessionId(?string $sessionId): static
    {
        $this->sessionId = $sessionId;

        return $this;
    }
}
