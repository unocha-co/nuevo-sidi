import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'validationError'})
export class ErrorMessagePipe implements PipeTransform {
    transform(value:any) {
        let r = ""
        if(value)
            switch (Object.keys(value)[0]) {
                case 'required':
                    r = 'Este campo es requerido';
                    break;
                case 'pattern':
                    r = 'El valor ingresado no es valido';
                    break;
            }
        return r;
    }
}
