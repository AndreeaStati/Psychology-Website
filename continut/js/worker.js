onmessage = function(e) {
    const produs = e.data;
    console.log("Worker: produs adaugat: ", produs);
    this.postMessage(produs);
}