export default function Header() : string{
    return /* html */`
    <div class="container">
        <header class="d-flex flex-wrap justify-content-center py-3 mb-1">
            <div class="d-flex align-items-center mb-1 mb-md-0 me-md-auto">
                <span class="fs-4" style="color:white;font-weight:600;">LOLIVIS</span>
            </div>
            <ul class="nav nav-pills">
                <i class="bi bi-box-arrow-in-right"></i>
                <li class="nav-item"><a href="#" class="nav-link">Github</a></li>
            </ul>
        </header>
    </div>
  `;
}