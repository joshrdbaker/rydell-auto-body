(function () {
  var jsonEl = document.getElementById('reviews-locations-json')
  if (!jsonEl) return

  var data = JSON.parse(jsonEl.textContent.trim())
  var byId = {}
  data.locations.forEach(function (loc) {
    byId[loc.id] = loc
  })

  var TIER1 = [
    {
      id: 'buying',
      label: 'Buying my vehicle',
      tier2: [
        'rydell-chevrolet-gmc',
        'rydell-cadillac',
        'rydell-toyota-gf',
        'rydell-honda-gf',
        'rydell-nissan-gf',
        'rydell-auto-outlet',
      ],
    },
    {
      id: 'servicing',
      label: 'Servicing my vehicle',
      tier2: [
        'rydell-toyota-service',
        'rydell-chevrolet-gmc',
        'rydell-cadillac',
        'rydell-toyota-gf',
        'rydell-honda-gf',
        'rydell-nissan-gf',
        'rydell-body-glass',
      ],
    },
    {
      id: 'selling',
      label: 'Selling my vehicle',
      tier2: [
        'rydell-auto-outlet',
        'rydell-chevrolet-gmc',
        'rydell-cadillac',
        'rydell-toyota-gf',
        'rydell-honda-gf',
        'rydell-nissan-gf',
      ],
    },
    {
      id: 'cleaning',
      label: 'Cleaning my vehicle',
      tier2: ['rydell-car-wash-s-wash', 'rydell-car-wash-gateway', 'rydell-detail-center'],
    },
  ]

  var state = {
    view: 'tier1',
    tier1: null,
    location: null,
  }

  function openReview(loc) {
    var url = loc.reviewUrl || loc.mapsUrl
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  var BTN_CLASS = 'btn btn-block reviews-picker-btn'

  function render() {
    var root = document.getElementById('reviews-app')
    if (!root) return

    if (state.view === 'thanks') {
      root.innerHTML =
        '<div class="reviews-thanks-panel">' +
        '<p class="reviews-thanks-msg">Thanks for taking the time — your review opened in a new tab.</p>' +
        '<button type="button" id="reviews-btn-pick-again" class="btn reviews-btn-primary btn-lg btn-block">' +
        'Pick a different location</button>' +
        '</div>'
      document.getElementById('reviews-btn-pick-again').addEventListener('click', function () {
        state.view = 'tier1'
        state.tier1 = null
        state.location = null
        render()
      })
      return
    }

    if (state.view === 'tier1') {
      root.innerHTML =
        '<div class="reviews-picker-module reviews-picker-module--tier1">' +
        '<h2 class="reviews-tier-heading reviews-tier-heading--on-red">What were you in for?</h2>' +
        '<div class="row reviews-picker-grid" id="reviews-tier1-grid"></div>' +
        '</div>'
      var grid = document.getElementById('reviews-tier1-grid')
      TIER1.forEach(function (item) {
        var col = document.createElement('div')
        col.className = 'col-xs-12 col-md-6'
        var btn = document.createElement('button')
        btn.type = 'button'
        btn.className = BTN_CLASS
        btn.textContent = item.label
        btn.addEventListener('click', function () {
          if (item.tier2) {
            state.view = 'tier2'
            state.tier1 = item
          } else if (item.locationId) {
            var loc = byId[item.locationId]
            if (loc) openReview(loc)
            state.location = loc || null
            state.view = 'thanks'
          }
          render()
        })
        col.appendChild(btn)
        grid.appendChild(col)
      })
      return
    }

    if (state.view === 'tier2' && state.tier1 && state.tier1.tier2) {
      var ids = state.tier1.tier2
      root.innerHTML =
        '<div class="reviews-tier-wrap">' +
        '<button type="button" id="reviews-btn-back" class="btn btn-link reviews-back-btn">' +
        '<span aria-hidden="true">←</span> Back</button>' +
        '<h2 class="reviews-tier-heading">Which location?</h2>' +
        '<div class="row reviews-picker-grid" id="reviews-tier2-grid"></div>' +
        '</div>'
      document.getElementById('reviews-btn-back').addEventListener('click', function () {
        state.view = 'tier1'
        state.tier1 = null
        render()
      })
      var grid2 = document.getElementById('reviews-tier2-grid')
      ids.forEach(function (id) {
        var loc = byId[id]
        if (!loc) return
        var col = document.createElement('div')
        col.className = 'col-xs-12 col-md-6'
        var btn = document.createElement('button')
        btn.type = 'button'
        btn.className = BTN_CLASS
        btn.textContent = loc.pickerLabel
        btn.addEventListener('click', function () {
          openReview(loc)
          state.location = loc
          state.view = 'thanks'
          render()
        })
        col.appendChild(btn)
        grid2.appendChild(col)
      })
    }
  }

  render()
})()
