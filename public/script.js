// Crea el Calendario
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale:"ES",
      headerToolbar:{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
      },
       dateClick: function(info){
          
          $("#evento").modal("show");
      }  
      

    });
    calendar.render();
  });

  //Fin del calendario

  //Funcion para el click
  


  