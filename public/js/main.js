$(document).ready(function(){
  $('.delete-event').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/users/eventList/'+id,
      success: function(response){
        alert('Deleting Event');
        window.location.href="/frontend";

      },
      error: function(err){
        console.log(err);
      }
    });
  });

  $('.delete-contact').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/users/contacts/'+id,
      success: function(response){
        alert('Deleting Contact');
        window.location.href="/frontend";
      },
      error: function(err){
        console.log(err);
      }
    });
  });

//is not actually used but for better delete purpose
// might be used later
  $('.delete-comment').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    //var event_id = $('#eventId_forDeletingComment').val();
    //var comment_id = $('#commentId_forDelete').val();
    $.ajax({
      type: 'DELETE',
      url: '/users/eventList/comment/'+id,
      success: function(response){
        alert('Deleting comment');
        window.location.href='/users/eventList/comment/'+id;
      },
      error: function(err){
        console.log(err);
      }
    });
  });


});
