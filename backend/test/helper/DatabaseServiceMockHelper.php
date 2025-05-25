<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Tests\Helper;

use PHPUnit\Framework\MockObject\MockObject;
use Service\DatabaseService;

trait DatabaseServiceMockHelper {
    /** @var MockObject|DatabaseService */
    protected $dbService;

    protected function mockDatabaseService(): void {
        $this->dbService = $this->createMock(DatabaseService::class);
    }

    protected function mockConsulta(string $query, array $params, $returnValue): void {
        $this->dbService->method('ejecutarConsulta')
            ->with($this->equalTo($query), $this->equalTo($params))
            ->willReturn($returnValue);
    }

    protected function mockAccion(string $query, array $params, $returnValue = true): void {
        $this->dbService->method('ejecutarAccion')
            ->with($this->equalTo($query), $this->equalTo($params))
            ->willReturn($returnValue);
    }
}
