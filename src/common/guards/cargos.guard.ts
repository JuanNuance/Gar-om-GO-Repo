import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHAVE_CARGOS } from '../decorators/cargos.decorator';

@Injectable()
export class CargosGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const cargosNecessarios = this.reflector.getAllAndOverride<string[]>(CHAVE_CARGOS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!cargosNecessarios) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    
    return cargosNecessarios.some((cargo) => user?.role?.includes(cargo));
  }
}
