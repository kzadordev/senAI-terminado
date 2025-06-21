// Diccionario de preguntas por tema disciplinario
const preguntasPorTema = {
    inasistencias: [
        { texto: "¿Las inasistencias son injustificadas?", si: 1, no: 1 },
        { texto: "¿El aprendiz acumula 3 o más inasistencias en el trimestre?", si: 2, no: 2 },
        { texto: "¿El aprendiz ha presentado excusas válidas para sus inasistencias?", si: 'FIN_SI_LEVE', no: 'FIN_SI_GRAVE' }
    ],
    fraude_plagio: [
        { texto: "¿La conducta implica fraude, plagio o suplantación en actividades de aprendizaje o evaluaciones?", si: 1, no: 1 },
        { texto: "¿El aprendiz ha incumplido los plazos establecidos para la entrega de evidencias sin justificación válida?", si: 2, no: 2 },
        { texto: "¿El aprendiz ha falsificado documentos o información para su proceso de formación?", si: 'FIN_SI_GRAVE', no: 'FIN_NO_MAS_FALTAS_TEMA' }
    ],
    convivencia: [
        { texto: "¿La conducta implica agresión física o verbal, acoso o discriminación?", si: 1, no: 1 },
        { texto: "¿Se ha detectado alguna conducta que atente contra la convivencia, el respeto o la integridad de la comunidad SENA?", si: 2, no: 2 },
        { texto: "¿El aprendiz ha promovido o participado en altercados o actos de indisciplina?", si: 'FIN_SI_LEVE_GRAVE', no: 'FIN_NO_MAS_FALTAS_TEMA' }
    ],
    recursos: [
        { texto: "¿El aprendiz ha utilizado de forma inadecuada los bienes, recursos o infraestructura del SENA?", si: 1, no: 1 },
        { texto: "¿Ha causado daños intencionales o por negligencia a los equipos o instalaciones?", si: 2, no: 2 },
        { texto: "¿Ha manipulado sin autorización equipos o herramientas?", si: 'FIN_SI_LEVE_GRAVE', no: 'FIN_NO_MAS_FALTAS_TEMA' }
    ],
    seguridad: [
        { texto: "¿El aprendiz ha incumplido las medidas de seguridad y salud en el trabajo o las normas de higiene y prevención?", si: 1, no: 1 },
        { texto: "¿Ha puesto en riesgo su integridad o la de otros por imprudencia o negligencia?", si: 2, no: 2 },
        { texto: "¿Ha desatendido las indicaciones del instructor sobre el uso de elementos de protección personal?", si: 'FIN_SI_LEVE_GRAVE', no: 'FIN_NO_MAS_FALTAS_TEMA' }
    ],
    imagen: [
        { texto: "¿Existe algún indicio de que el aprendiz haya incurrido en actos que afecten el buen nombre del SENA o la imagen institucional?", si: 1, no: 1 },
        { texto: "¿Ha utilizado las redes sociales o medios de comunicación para difamar o atacar a la institución o a sus miembros?", si: 2, no: 2 },
        { texto: "¿Ha difundido información falsa sobre la institución?", si: 'FIN_SI_GRAVE', no: 'FIN_NO_MAS_FALTAS_TEMA' }
    ],
    generales: [
        { texto: "¿El aprendiz ha portado de manera indebida el uniforme, si aplica, o ha incumplido las normas de presentación personal establecidas?", si: 1, no: 1 },
        { texto: "¿Existe algún indicio de que el aprendiz haya incumplido el conducto regular establecido para peticiones, quejas o reclamos?", si: 2, no: 2 },
        { texto: "¿Ha desatendido las instrucciones o recomendaciones del instructor sin justificación?", si: 'FIN_SI_LEVE', no: 'FIN_NO_MAS_FALTAS_TEMA' }
    ],
};

let temaActual = null;
let preguntaActual = 0;

// Abre el modal y muestra los temas
function abrirModalDisciplinario(e) {
    if (e) e.stopPropagation();
    document.getElementById('modalDisciplinario').style.display = 'flex';
    document.getElementById('modalTemas').style.display = 'block';
    document.getElementById('modalPreguntas').style.display = 'none';
    document.getElementById('finalAccionDisciplinario').style.display = 'none';
}

// Selecciona un tema y muestra la primera pregunta
function seleccionarTema(tema) {
    temaActual = tema;
    preguntaActual = 0;
    document.getElementById('modalTemas').style.display = 'none';
    document.getElementById('modalPreguntas').style.display = 'block';
    document.getElementById('finalAccionDisciplinario').style.display = 'none';
    mostrarPreguntaTema();
}

// Muestra la pregunta actual del tema disciplinario
function mostrarPreguntaTema() {
    const preguntas = preguntasPorTema[temaActual];
    if (!preguntas || preguntas.length === 0 || preguntaActual < 0 || preguntaActual >= preguntas.length) {
        finalizarFlujoDisciplinario("No hay más preguntas definidas para este camino o el tema no tiene preguntas.");
        return;
    }
    const pregunta = preguntas[preguntaActual];
    document.getElementById('modalPregunta').textContent = pregunta.texto;
    let botones = '';
    botones += `<button class="btn" onclick="siguientePreguntaTema('si', event)">Sí</button>`;
    botones += `<button class="btn" onclick="siguientePreguntaTema('no', event)">No</button>`;
    document.getElementById('modalBotones').innerHTML = botones;
}

// Avanza según la respuesta en el tema disciplinario
function siguientePreguntaTema(respuesta, event) {
    if (event) event.stopPropagation();
    const preguntas = preguntasPorTema[temaActual];
    const pregunta = preguntas[preguntaActual];
    let nextStep = (respuesta === 'si') ? pregunta.si : pregunta.no;
    if (typeof nextStep === 'number') {
        preguntaActual = nextStep;
        mostrarPreguntaTema();
    } else if (typeof nextStep === 'string') {
        switch (nextStep) {
            case 'FIN_NO_FALTA':
                finalizarFlujoDisciplinario("No se identifica una falta disciplinaria o académica con la información proporcionada. Considerar remitir al aprendiz a acompañamiento por parte de Bienestar al Aprendiz si existen otras preocupaciones. Si la situación es académica y no disciplinaria, diríjase al 'Flujo Académico'.");
                break;
            case 'FIN_NO_FALTA_ACUMULACION':
                finalizarFlujoDisciplinario("Hay inasistencias injustificadas, pero no cumplen el umbral de acumulación para esta tipificación. Se recomienda documentar. Puede revisar otras categorías de faltas o cerrar este caso disciplinario si no hay más elementos.");
                break;
            case 'FIN_NO_MAS_FALTAS_TEMA':
                finalizarFlujoDisciplinario("La conducta no encaja en las faltas específicas de este tema. Puede explorar otros temas disciplinarios o cerrar la evaluación por esta vía.");
                break;
            case 'FIN_SI_LEVE':
                finalizarFlujoDisciplinario("Falta Disciplinaria Leve identificada. <b>Acciones Sugeridas:</b> Llamado de atención verbal con registro, compromiso del aprendiz, remisión a seguimiento.");
                break;
            case 'FIN_SI_LEVE_GRAVE':
                finalizarFlujoDisciplinario("Falta Disciplinaria Leve/Grave identificada (clasificación específica según reglamento). <b>Acciones Sugeridas:</b> Documentar la falta, citar a comité de evaluación y seguimiento, notificar al aprendiz.");
                break;
            case 'FIN_SI_GRAVE':
                finalizarFlujoDisciplinario("Falta Disciplinaria Grave identificada. <b>Acciones Sugeridas:</b> Documentar la falta, inicio de proceso disciplinario formal, citar a comité, posible suspensión.");
                break;
            default:
                finalizarFlujoDisciplinario("Se ha completado la revisión de este tema disciplinario.");
                break;
        }
    } else {
        finalizarFlujoDisciplinario("Se ha completado la revisión de este tema disciplinario.");
    }
}

function finalizarFlujoDisciplinario(mensaje) {
    document.getElementById('modalPreguntas').style.display = 'none';
    document.getElementById('finalAccionDisciplinario').style.display = 'block';
    const mensajeElement = document.getElementById('mensajeFinalDisciplinario');
    if (mensajeElement) {
        mensajeElement.innerHTML = mensaje;
    }
}

function volverTemas() {
    document.getElementById('modalTemas').style.display = 'block';
    document.getElementById('modalPreguntas').style.display = 'none';
    document.getElementById('finalAccionDisciplinario').style.display = 'none';
    preguntaActual = 0;
    temaActual = null;
}

function cerrarModalDisciplinario() {
    document.getElementById('modalDisciplinario').style.display = 'none';
    volverTemas();
}

document.addEventListener('click', function(e) {
    var modal = document.getElementById('modalDisciplinario');
    if (modal && modal.style.display === 'flex') {
        if (!modal.querySelector('.modal-content').contains(e.target)) {
            cerrarModalDisciplinario();
        }
    }
});

// --- FLUJO ACADÉMICO ---
const preguntasPorTemaAcademico = {
    resultados: [
        { texto: "¿El aprendiz ha presentado dificultades recurrentes en el logro de los resultados de aprendizaje o competencias?", si: 1, no: 'FIN_NO_PROBLEMA_ACADEMICO' },
        { texto: "¿Ha obtenido juicios de evaluación 'No Aprobado' en uno o varios resultados de aprendizaje?", si: 2, no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' },
        { texto: "¿Existe un patrón de bajo rendimiento en diversas áreas del programa de formación?", si: 'FIN_SI_RESULTADOS', no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' }
    ],
    evidencias: [
        { texto: "¿Las dificultades académicas se relacionan con la falta de presentación o entrega de evidencias de aprendizaje?", si: 1, no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' },
        { texto: "¿El aprendiz ha incumplido los plazos establecidos para la entrega de evidencias sin justificación válida?", si: 2, no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' },
        { texto: "¿La no entrega de evidencias ha afectado el avance en la ruta de aprendizaje?", si: 'FIN_SI_EVIDENCIAS', no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' }
    ],
    participacion: [
        { texto: "¿El aprendiz ha demostrado falta de participación o compromiso en las actividades de formación programadas (clases, talleres, proyectos)?", si: 1, no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' },
        { texto: "¿Su nivel de interacción o aporte en los espacios de aprendizaje es deficiente?", si: 2, no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' },
        { texto: "¿Se ausenta de las actividades presenciales o virtuales sin justificación?", si: 'FIN_SI_PARTICIPACION', no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' }
    ],
    mejoramiento: [
        { texto: "¿Se le ha brindado al aprendiz un plan de mejoramiento o actividades complementarias para superar las dificultades?", si: 1, no: 'FIN_NO_PLAN_EXISTE' },
        { texto: "¿El aprendiz ha participado activamente y ha demostrado compromiso con el plan de mejoramiento o las actividades complementarias?", si: 2, no: 'FIN_NO_COMPROMISO_PLAN' },
        { texto: "¿A pesar del plan de mejoramiento, las dificultades persisten?", si: 'FIN_SI_PERSISTE_PLAN', no: 'FIN_NO_PERSISTE_PLAN' }
    ],
    prerrequisitos: [
        { texto: "¿Se ha detectado que el aprendiz no cumple con los prerrequisitos académicos para avanzar en su ruta de aprendizaje?", si: 1, no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' },
        { texto: "¿Las dificultades del aprendiz están impidiendo el avance normal del grupo o del proceso formativo?", si: 'FIN_SI_PRERREQUISITOS', no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' }
    ],
    tecnologia: [
        { texto: "¿Existe algún indicio de que el aprendiz no está utilizando adecuadamente los recursos o herramientas tecnológicas puestas a su disposición para el aprendizaje?", si: 1, no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' },
        { texto: "¿Las dificultades se derivan de un uso ineficiente o incorrecto de las plataformas virtuales o software específico del programa?", si: 'FIN_SI_TECNOLOGIA', no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' }
    ],
    acuerdos: [
        { texto: "¿El aprendiz ha incumplido con los acuerdos o compromisos académicos establecidos con el instructor o el equipo de formación?", si: 1, no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' },
        { texto: "¿Se ha evidenciado una falta de seguimiento a las recomendaciones dadas para su progreso académico?", si: 'FIN_SI_ACUERDOS', no: 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO' }
    ]
};

let temaActualAcademico = null;
let preguntaActualAcademico = 0;

function abrirModalAcademico(e) {
    if (e) e.stopPropagation();
    document.getElementById('modalAcademico').style.display = 'flex';
    document.getElementById('modalTemasAcademico').style.display = 'block';
    document.getElementById('modalPreguntasAcademico').style.display = 'none';
    document.getElementById('finalAccionAcademico').style.display = 'none';
}

function seleccionarTemaAcademico(tema) {
    temaActualAcademico = tema;
    preguntaActualAcademico = 0;
    document.getElementById('modalTemasAcademico').style.display = 'none';
    document.getElementById('modalPreguntasAcademico').style.display = 'block';
    document.getElementById('finalAccionAcademico').style.display = 'none';
    mostrarPreguntaTemaAcademico();
}

function mostrarPreguntaTemaAcademico() {
    const preguntas = preguntasPorTemaAcademico[temaActualAcademico];
    if (!preguntas || preguntas.length === 0 || preguntaActualAcademico < 0 || preguntaActualAcademico >= preguntas.length) {
        finalizarFlujoAcademico("No hay más preguntas definidas para este camino o el tema no tiene preguntas.");
        return;
    }
    const pregunta = preguntas[preguntaActualAcademico];
    document.getElementById('modalPreguntaAcademico').textContent = pregunta.texto;
    let botones = '';
    botones += `<button class="btn" onclick="siguientePreguntaTemaAcademico('si', event)">Sí</button>`;
    botones += `<button class="btn" onclick="siguientePreguntaTemaAcademico('no', event)">No</button>`;
    document.getElementById('modalBotonesAcademico').innerHTML = botones;
}

function siguientePreguntaTemaAcademico(respuesta, event) {
    if (event) event.stopPropagation();
    const preguntas = preguntasPorTemaAcademico[temaActualAcademico];
    const pregunta = preguntas[preguntaActualAcademico];
    let nextStep = (respuesta === 'si') ? pregunta.si : pregunta.no;
    if (typeof nextStep === 'number') {
        preguntaActualAcademico = nextStep;
        mostrarPreguntaTemaAcademico();
    } else if (typeof nextStep === 'string') {
        switch (nextStep) {
            case 'FIN_NO_PROBLEMA_ACADEMICO':
                finalizarFlujoAcademico("No se identifican problemas académicos recurrentes con la información proporcionada. Felicitar al aprendiz por su buen desempeño.");
                break;
            case 'FIN_NO_MAS_PROBLEMAS_TEMA_ACADEMICO':
                finalizarFlujoAcademico("La situación no encaja en las problemáticas específicas de este tema. Puede explorar otros temas académicos, remitir a Bienestar, o cerrar la evaluación por esta vía.");
                break;
            case 'FIN_NO_PLAN_EXISTE':
                finalizarFlujoAcademico("Es fundamental brindar un plan de mejoramiento. <b>Acciones Sugeridas:</b> Diseñar e implementar un plan de mejoramiento o actividades complementarias de inmediato.");
                break;
            case 'FIN_NO_COMPROMISO_PLAN':
                finalizarFlujoAcademico("El aprendiz no ha demostrado compromiso con el plan de mejoramiento. <b>Acciones Sugeridas:</b> Reevaluar el plan, citar a diálogo con aprendiz y/o acudiente, considerar remisión a comité de evaluación y seguimiento (podría escalar a disciplinario por incumplimiento de deberes).");
                break;
            case 'FIN_SI_RESULTADOS':
                finalizarFlujoAcademico("Se identifican dificultades en el logro de resultados de aprendizaje. <b>Acciones Sugeridas:</b> Implementar plan de mejoramiento, refuerzo académico, seguimiento individualizado, remisión a Bienestar si hay factores externos.");
                break;
            case 'FIN_SI_EVIDENCIAS':
                finalizarFlujoAcademico("Se identifica incumplimiento en la entrega de evidencias. <b>Acciones Sugeridas:</b> Establecer compromisos de entrega, recordatorio de plazos, ofrecer apoyo para la realización de evidencias, seguimiento cercano.");
                break;
            case 'FIN_SI_PARTICIPACION':
                finalizarFlujoAcademico("Se identifica baja participación y compromiso. <b>Acciones Sugeridas:</b> Diálogo con el aprendiz para identificar causas, estrategias para fomentar la participación, remisión a Bienestar si hay problemas subyacentes.");
                break;
            case 'FIN_SI_PERSISTE_PLAN':
                finalizarFlujoAcademico("Las dificultades persisten a pesar del plan de mejoramiento. <b>Acciones Sugeridas:</b> Evaluar ajuste del plan, considerar segunda oportunidad de mejoramiento, remisión a comité de evaluación y seguimiento, evaluar remisión a Bienestar.");
                break;
            case 'FIN_SI_PRERREQUISITOS':
                finalizarFlujoAcademico("El aprendiz no cumple con prerrequisitos para avanzar. <b>Acciones Sugeridas:</b> Diseñar estrategias de nivelación, considerar ajustes en la ruta formativa, remisión a coordinación académica.");
                break;
            case 'FIN_SI_TECNOLOGIA':
                finalizarFlujoAcademico("Se identifica uso inadecuado de recursos tecnológicos. <b>Acciones Sugeridas:</b> Capacitación en el uso de herramientas, seguimiento a la conexión y acceso, remisión a soporte técnico si es necesario.");
                break;
            case 'FIN_SI_ACUERDOS':
                finalizarFlujoAcademico("El aprendiz ha incumplido acuerdos académicos. <b>Acciones Sugeridas:</b> Recordatorio de compromisos, reestablecer acuerdos, documentar incumplimientos, posible escalamiento a disciplinario si es recurrente y deliberado.");
                break;
            default:
                finalizarFlujoAcademico("Se ha completado la revisión de este tema académico.");
                break;
        }
    } else {
        finalizarFlujoAcademico("Se ha completado la revisión de este tema académico.");
    }
}

function finalizarFlujoAcademico(mensaje) {
    document.getElementById('modalPreguntasAcademico').style.display = 'none';
    document.getElementById('finalAccionAcademico').style.display = 'block';
    const mensajeElement = document.getElementById('mensajeFinalAcademico');
    if (mensajeElement) {
        mensajeElement.innerHTML = mensaje;
    }
}

function volverTemasAcademico() {
    document.getElementById('modalTemasAcademico').style.display = 'block';
    document.getElementById('modalPreguntasAcademico').style.display = 'none';
    document.getElementById('finalAccionAcademico').style.display = 'none';
    preguntaActualAcademico = 0;
    temaActualAcademico = null;
}

function cerrarModalAcademico() {
    document.getElementById('modalAcademico').style.display = 'none';
    volverTemasAcademico();
}

document.addEventListener('click', function(e) {
    var modal = document.getElementById('modalAcademico');
    if (modal && modal.style.display === 'flex') {
        if (!modal.querySelector('.modal-content').contains(e.target)) {
            cerrarModalAcademico();
        }
    }
});

function descargarFormatoDisciplinario() {
    window.open('/static/docs/PROTOCOLO DISCIPLINARIO SENA 2025 rev..docx', '_blank');
}
function descargarFormatoAcademico() {
    window.open('/static/docs/MEDIDAS FORMATIVAS ACADEMICAS.docx', '_blank');
}