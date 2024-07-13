<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240713063101 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create sessions table';
    }

    public function up(Schema $schema): void
    {
        // This migration is for MySQL, adjust the types if you are using another database
        $this->addSql('
            CREATE TABLE sessions (
                sess_id VARBINARY(128) NOT NULL PRIMARY KEY,
                sess_data BLOB NOT NULL,
                sess_lifetime INTEGER UNSIGNED NOT NULL,
                sess_time INTEGER UNSIGNED NOT NULL
            ) COLLATE utf8mb4_bin, ENGINE = InnoDB;
        ');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs

    }
}
