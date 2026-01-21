
import { httpService } from './http.service.js'
import { getRandomIntInclusive } from './util.service.js'



export const gigService = {
    query,
    getById,
    save,
    remove,
    getEmptyGig,
    addGigMsg
}
window.cs = gigService


async function query(filterBy = { txt: '',maxBudget: '', loc: null, daysToMake: '', ownerLevel: null, avgResponseTime: null, ownerRate: null, category: '', sortField: 'recommended'  }) {
    return httpService.get('gig', filterBy)
}
function getById(gigId) {
    return httpService.get(`gig/${gigId}`)
}

async function remove(gigId) {
    return httpService.delete(`gig/${gigId}`)
}
async function save(gig) {
    var savedGig
    if (gig._id) {
        savedGig = await httpService.put(`gig/${gig._id}`, gig)

    } else {
        savedGig = await httpService.post('gig', gig)
    }
    return savedGig
}

async function addGigMsg(gigId, txt) {
    const savedMsg = await httpService.post(`gig/${gigId}/msg`, {txt})
    return savedMsg
}


function getEmptyGig() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: getRandomIntInclusive(1000, 9000),
    }
}





