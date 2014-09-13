# IIFE
# argument à la fin
(($) ->
  $ -> # on jQuery DOM READY
    $('body').html 'DOM READY'
    return
  return
) LPUJQ

# IIFE + Factory
# arguments au début !!
((f) ->
  return f LPUJQ, window.document
)         ($, d) -> # NE PAS OUBLIER L'ESPACE ENTRE LES 2 PARENTHÈSES !!
  $ -> # on jQuery DOM READY
    $a = $(d.createElement 'a')
    $a.attr 'href', 'http://google.com'
    return
  return
    # ton code !
