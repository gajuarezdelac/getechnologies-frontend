export interface Invoice {
    id: number
    fechaCreacion: number
    monto: number
    persona: Persona
  }
  
  export interface Persona {
    id: number
    nombre: string
    apellidoMaterno: string
    apellidoPaterno: string
    identificacion: string
  }
  