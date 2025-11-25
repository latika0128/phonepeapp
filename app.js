const screens = document.querySelectorAll('[data-screen]')
const appShell = document.getElementById('app')
const navButtons = document.querySelectorAll('[data-nav]')
const backButton = document.getElementById('backButton')

// Login refs
const mobileInput = document.getElementById('mobileInput')
const mobileHelper = document.getElementById('mobileHelper')
const otpButton = document.getElementById('otpButton')
const otpSection = document.getElementById('otpSection')
const otpInputs = Array.from(document.querySelectorAll('#otpInputs input'))
const verifyButton = document.getElementById('verifyButton')
const resendButton = document.getElementById('resendButton')

// Dashboard refs
const walletBalance = document.getElementById('walletBalance')
const walletUpiId = document.getElementById('walletUpiId')
const quickActionsContainer = document.getElementById('quickActions')
const servicesGrid = document.getElementById('servicesGrid')

// UPI setup
const setupStageLabel = document.getElementById('setupStageLabel')
const setupStepContainer = document.getElementById('upsStepContainer')

// History
const transactionList = document.getElementById('transactionList')
const dateFiltersContainer = document.getElementById('dateFilters')
const typeFiltersContainer = document.getElementById('typeFilters')
const clearFilterButton = document.getElementById('clearFilterButton')

// Send money
const sendUpiInput = document.getElementById('sendUpiInput')
const sendUpiNext = document.getElementById('sendUpiNext')
const sendAmountSubtitle = document.getElementById('sendAmountSubtitle')
const sendAmountInput = document.getElementById('sendAmountInput')
const sendAmountNext = document.getElementById('sendAmountNext')
const sendConfirmCard = document.getElementById('sendConfirmCard')
const sendConfirmButton = document.getElementById('sendConfirmButton')
const sendEditButton = document.getElementById('sendEditButton')

// Request money
const requestUpiInput = document.getElementById('requestUpiInput')
const requestUpiNext = document.getElementById('requestUpiNext')
const requestAmountSubtitle = document.getElementById('requestAmountSubtitle')
const requestAmountInput = document.getElementById('requestAmountInput')
const requestAmountNext = document.getElementById('requestAmountNext')
const requestConfirmCard = document.getElementById('requestConfirmCard')
const requestConfirmButton = document.getElementById('requestConfirmButton')
const requestEditButton = document.getElementById('requestEditButton')

// Status
const statusCard = document.getElementById('statusCard')
const statusRetryButton = document.getElementById('statusRetryButton')

const state = {
  screen: 'login',
  otpRequested: false,
  otpValues: Array(6).fill(''),
  sendFlow: { upi: '', amount: 0 },
  requestFlow: { upi: '', amount: 0 },
  filters: { date: 'All dates', type: 'All types' },
  upiSetupStep: 0,
}

const navHistory = []
let resendTimer
let resendCountdown = 28

const walletData = {
  balance: '₹12,540.65',
  upiId: 'yash@phonepe',
}

const quickActions = [
  { label: 'Send money', desc: 'UPI / Contacts', target: 'send-upi' },
  { label: 'Request money', desc: 'Collect via UPI', target: 'request-upi' },
  { label: 'History', desc: 'Past payments', target: 'history' },
  { label: 'UPI setup', desc: 'Link bank', target: 'upi-setup' },
]

const services = [
  { name: 'Send Money', hint: 'UPI / Contacts', icon: '💸', target: 'send-upi' },
  { name: 'Request', hint: 'Ask via UPI', icon: '📥', target: 'request-upi' },
  { name: 'Transactions', hint: 'History', icon: '🧾', target: 'history' },
  { name: 'Bills', hint: 'Utilities', icon: '⚡' },
  { name: 'Travel', hint: 'Tickets', icon: '✈️' },
  { name: 'Rewards', hint: 'Cashback', icon: '🎁' },
]

const bankOptions = [
  { id: 'hdfc', name: 'HDFC Bank', masked: '****4321' },
  { id: 'sbi', name: 'State Bank of India', masked: '****9900' },
  { id: 'icici', name: 'ICICI Bank', masked: '****7711' },
  { id: 'axis', name: 'Axis Bank', masked: '****1212' },
]

const setupSteps = [
  {
    title: 'Select your bank',
    description: 'Choose a bank to link with UPI.',
    render: () => `
      <label class="input-field">
        <span class="input-field__label">Bank</span>
        <span class="input-field__control">
          <select id="bankSelect">
            ${bankOptions
              .map((bank) => `<option value="${bank.id}">${bank.name} (${bank.masked})</option>`)
              .join('')}
          </select>
        </span>
      </label>
      <button class="btn btn--primary btn--full" id="nextSetupStep">Continue</button>
    `,
  },
  {
    title: 'Verify with SMS',
    description: 'We need to confirm your registered mobile number.',
    render: () => `
      <p>We will send an SMS from your registered SIM to the bank. Please keep ₹1 balance.</p>
      <button class="btn btn--primary btn--full" id="nextSetupStep">Verify now</button>
      <button class="link-button" id="setupBackStep">Go back</button>
    `,
  },
  {
    title: 'UPI ID generated',
    description: 'You are ready to make payments via PhonePe.',
    render: () => `
      <div class="confirmation-row">
        <span>New UPI ID</span>
        <strong>${walletData.upiId}</strong>
      </div>
      <div class="confirmation-row">
        <span>Linked bank</span>
        <strong>HDFC Bank</strong>
      </div>
      <button class="btn btn--primary btn--full" data-nav-target="dashboard">Done</button>
    `,
  },
]

const dateFilters = ['All dates', 'Today', 'This week', 'This month']
const typeFilters = ['All types', 'Debit', 'Credit', 'Pending', 'Failed']

const transactions = [
  {
    id: 'tx-1',
    title: 'Sent to Rahul',
    subtitle: 'UPI • rahul@ybl',
    amount: -2500,
    type: 'debit',
    status: 'success',
    dateLabel: 'Today',
    time: '10:24 AM',
    note: 'Split dinner bill',
  },
  {
    id: 'tx-2',
    title: 'Received from Swiggy',
    subtitle: 'Refund • SWG1234',
    amount: 320,
    type: 'credit',
    status: 'success',
    dateLabel: 'Yesterday',
    time: '9:13 PM',
    note: 'Order cancellation',
  },
  {
    id: 'tx-3',
    title: 'Electricity Bill',
    subtitle: 'BESCOM • CA 8890',
    amount: -1480,
    type: 'debit',
    status: 'pending',
    dateLabel: 'This week',
    time: '3:48 PM',
    note: 'Awaiting confirmation',
  },
  {
    id: 'tx-4',
    title: 'Movie Tickets',
    subtitle: 'BookMyShow • BMS889',
    amount: -890,
    type: 'debit',
    status: 'success',
    dateLabel: 'This week',
    time: '8:02 PM',
    note: 'Weekend movie night',
  },
  {
    id: 'tx-5',
    title: 'Cashback Reward',
    subtitle: 'PhonePe Wallet',
    amount: 150,
    type: 'credit',
    status: 'success',
    dateLabel: 'This month',
    time: '6:14 PM',
    note: 'Scratch card',
  },
  {
    id: 'tx-6',
    title: 'Metro Top-up',
    subtitle: 'BMRCL SmartCard',
    amount: -600,
    type: 'debit',
    status: 'failed',
    dateLabel: 'This month',
    time: '7:45 AM',
    note: 'Network timeout',
  },
]

const statusSamples = [
  {
    status: 'success',
    title: 'Payment successful',
    message: '₹2,500 sent to Rahul.',
    timestamp: 'Today, 10:25 AM',
  },
  {
    status: 'failed',
    title: 'Payment failed',
    message: 'UPI switch unreachable. Try again.',
    timestamp: 'Today, 9:10 AM',
  },
  {
    status: 'pending',
    title: 'Awaiting bank response',
    message: 'Most pending payments resolve in 30 minutes.',
    timestamp: 'Today, 7:45 AM',
  },
]

function formatAmount(value) {
  const sign = value < 0 ? '-' : '+'
  const absolute = Math.abs(value).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return `${sign} ₹${absolute}`
}

function setScreen(screen, options = {}) {
  const { pushHistory = true, resetHistory = false } = options

  if (resetHistory) {
    navHistory.length = 0
  } else if (
    pushHistory &&
    state.screen &&
    state.screen !== 'login' &&
    state.screen !== screen
  ) {
    navHistory.push(state.screen)
  }

  state.screen = screen
  screens.forEach((section) => {
    section.classList.toggle('hidden', section.dataset.screen !== screen)
  })

  const isLogin = screen === 'login'
  appShell.classList.toggle('app-shell--auth', isLogin)

  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.nav === screen)
  })

  backButton.style.visibility = navHistory.length && !isLogin ? 'visible' : 'hidden'
}

function goBack() {
  const previous = navHistory.pop()
  if (previous) {
    setScreen(previous, { pushHistory: false })
  }
}

function updateMobileState() {
  const digits = mobileInput.value.replace(/\D/g, '').slice(0, 10)
  mobileInput.value = digits

  if (digits.length === 10) {
    mobileHelper.textContent = 'Looks good! OTP will be sent instantly.'
    otpButton.disabled = false
  } else {
    mobileHelper.textContent = 'Enter a valid 10-digit number.'
    otpButton.disabled = true
  }
}

function showOtpInputs() {
  state.otpRequested = true
  otpSection.classList.add('is-visible')
  otpInputs.forEach((input) => {
    input.disabled = false
    input.value = ''
  })
  state.otpValues = Array(6).fill('')
  otpInputs[0].focus()
  verifyButton.disabled = true
  startResendTimer()
}

function startResendTimer() {
  clearInterval(resendTimer)
  resendCountdown = 28
  resendButton.disabled = true
  resendButton.textContent = `Resend OTP in ${resendCountdown}s`

  resendTimer = setInterval(() => {
    resendCountdown -= 1
    if (resendCountdown <= 0) {
      clearInterval(resendTimer)
      resendButton.disabled = false
      resendButton.textContent = 'Resend OTP'
      return
    }
    resendButton.textContent = `Resend OTP in ${resendCountdown}s`
  }, 1000)
}

function handleOtpInput(index, value) {
  if (!/^\d?$/.test(value)) {
    otpInputs[index].value = state.otpValues[index]
    return
  }

  state.otpValues[index] = value
  if (value && index < otpInputs.length - 1) {
    otpInputs[index + 1].focus()
  }
  updateVerifyState()
}

function handleOtpBackspace(index) {
  if (!state.otpValues[index] && index > 0) {
    otpInputs[index - 1].focus()
  }
}

function updateVerifyState() {
  const complete = state.otpValues.every((digit) => digit.trim().length === 1)
  verifyButton.disabled = !complete
}

function handleVerify() {
  walletBalance.textContent = walletData.balance
  walletUpiId.textContent = walletData.upiId
  setScreen('dashboard', { resetHistory: true })
}

function renderQuickActions() {
  quickActionsContainer.innerHTML = ''
  quickActions.forEach((action) => {
    const button = document.createElement('button')
    button.className = 'quick-action'
    button.innerHTML = `<strong>${action.label}</strong><span>${action.desc}</span>`
    button.addEventListener('click', () => setScreen(action.target))
    quickActionsContainer.appendChild(button)
  })
}

function renderServices() {
  servicesGrid.innerHTML = ''
  services.forEach((service) => {
    const card = document.createElement('div')
    card.className = 'services-grid__item'
    card.innerHTML = `
      <div class="services-grid__icon">${service.icon}</div>
      <p class="services-grid__name">${service.name}</p>
      <p class="services-grid__hint">${service.hint ?? ''}</p>
    `
    if (service.target) {
      card.style.cursor = 'pointer'
      card.addEventListener('click', () => setScreen(service.target))
    }
    servicesGrid.appendChild(card)
  })
}

function renderSetupStep() {
  const step = setupSteps[state.upiSetupStep]
  setupStageLabel.textContent = `Step ${state.upiSetupStep + 1} of ${setupSteps.length}`
  document.querySelectorAll('[data-step-indicator]').forEach((el, idx) => {
    el.classList.toggle('active', idx <= state.upiSetupStep)
  })

  setupStepContainer.innerHTML = `
    <header class="card__header">
      <div>
        <p class="card__title">${step.title}</p>
        <p class="card__subtitle">${step.description}</p>
      </div>
    </header>
    <div class="setup-step-body">
      ${step.render()}
    </div>
  `

  const nextBtn = document.getElementById('nextSetupStep')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      state.upiSetupStep = Math.min(setupSteps.length - 1, state.upiSetupStep + 1)
      renderSetupStep()
    })
  }

  const backBtn = document.getElementById('setupBackStep')
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      state.upiSetupStep = Math.max(0, state.upiSetupStep - 1)
      renderSetupStep()
    })
  }

  setupStepContainer.querySelectorAll('[data-nav-target]').forEach((node) => {
    node.addEventListener('click', () => setScreen(node.dataset.navTarget))
  })
}

function renderFilters() {
  dateFiltersContainer.innerHTML = ''
  dateFilters.forEach((label) => {
    const chip = document.createElement('span')
    chip.className = ['filter-chip', state.filters.date === label ? 'is-active' : '']
      .filter(Boolean)
      .join(' ')
    chip.textContent = label
    chip.addEventListener('click', () => {
      state.filters.date = label
      renderFilters()
      renderTransactions()
    })
    dateFiltersContainer.appendChild(chip)
  })

  typeFiltersContainer.innerHTML = ''
  typeFilters.forEach((label) => {
    const chip = document.createElement('span')
    chip.className = ['filter-chip', state.filters.type === label ? 'is-active' : '']
      .filter(Boolean)
      .join(' ')
    chip.textContent = label
    chip.addEventListener('click', () => {
      state.filters.type = label
      renderFilters()
      renderTransactions()
    })
    typeFiltersContainer.appendChild(chip)
  })
}

function renderTransactions() {
  const filtered = transactions.filter((tx) => {
    const dateMatch = state.filters.date === 'All dates' || tx.dateLabel === state.filters.date
    const typeMatch =
      state.filters.type === 'All types' ||
      tx.type === state.filters.type.toLowerCase() ||
      tx.status === state.filters.type.toLowerCase()
    return dateMatch && typeMatch
  })

  transactionList.innerHTML = ''
  filtered.forEach((tx) => {
    const item = document.createElement('div')
    item.className = 'transaction-item'
    item.innerHTML = `
      <div class="transaction-row">
        <div class="transaction-item__meta">
          <div class="transaction-item__avatar is-${tx.type}">${tx.type === 'debit' ? '↗' : '↘'}</div>
          <div>
            <p class="transaction-item__title">${tx.title}</p>
            <p class="transaction-item__subtitle">${tx.subtitle}</p>
          </div>
        </div>
        <div class="transaction-item__details">
          <p class="transaction-item__amount">${formatAmount(tx.amount)}</p>
          <p class="transaction-item__status is-${tx.status}">${tx.status}</p>
          <p class="transaction-item__date">${tx.dateLabel}, ${tx.time}</p>
        </div>
      </div>
      <div class="transaction-details">
        <p>${tx.note}</p>
      </div>
    `
    item.addEventListener('click', () => item.classList.toggle('expanded'))
    transactionList.appendChild(item)
  })
}

function updateSendFlow() {
  const upi = sendUpiInput.value.trim()
  state.sendFlow.upi = upi
  sendUpiNext.disabled = upi.length < 5
}

function updateSendAmount() {
  const amount = Number(sendAmountInput.value)
  state.sendFlow.amount = amount
  sendAmountNext.disabled = !(amount > 0)
}

function openSendAmount() {
  sendAmountSubtitle.textContent = `Paying ${state.sendFlow.upi}`
  sendAmountInput.value = state.sendFlow.amount || ''
  updateSendAmount()
  setScreen('send-amount')
}

function openSendConfirm() {
  sendConfirmCard.innerHTML = `
    <div class="confirmation-row">
      <span>To</span>
      <strong>${state.sendFlow.upi}</strong>
    </div>
    <div class="confirmation-row">
      <span>Amount</span>
      <strong>${formatAmount(state.sendFlow.amount)}</strong>
    </div>
    <div class="confirmation-row">
      <span>Paying from</span>
      <strong>${walletData.upiId}</strong>
    </div>
  `
  setScreen('send-confirm')
}

function updateRequestFlow() {
  const upi = requestUpiInput.value.trim()
  state.requestFlow.upi = upi
  requestUpiNext.disabled = upi.length < 5
}

function updateRequestAmount() {
  const amount = Number(requestAmountInput.value)
  state.requestFlow.amount = amount
  requestAmountNext.disabled = !(amount > 0)
}

function openRequestAmount() {
  requestAmountSubtitle.textContent = `Requesting from ${state.requestFlow.upi}`
  requestAmountInput.value = state.requestFlow.amount || ''
  updateRequestAmount()
  setScreen('request-amount')
}

function openRequestConfirm() {
  requestConfirmCard.innerHTML = `
    <div class="confirmation-row">
      <span>From</span>
      <strong>${state.requestFlow.upi}</strong>
    </div>
    <div class="confirmation-row">
      <span>Amount</span>
      <strong>${formatAmount(state.requestFlow.amount)}</strong>
    </div>
    <div class="confirmation-row">
      <span>Status</span>
      <strong>Awaiting payer approval</strong>
    </div>
  `
  setScreen('request-confirm')
}

function renderStatusCard(statusData = statusSamples[0]) {
  statusCard.className = `card card--shadow status-card ${statusData.status}`
  statusCard.innerHTML = `
    <p class="status-title">${statusData.title}</p>
    <p class="status-meta">${statusData.message}</p>
    <div class="confirmation-row">
      <span>Timeline</span>
      <strong>${statusData.timestamp}</strong>
    </div>
  `
}

function wireNavigationTargets() {
  document.querySelectorAll('[data-nav-target]').forEach((element) => {
    element.addEventListener('click', () => setScreen(element.dataset.navTarget))
  })
}

// Event listeners
navButtons.forEach((button) => {
  button.addEventListener('click', () =>
    setScreen(button.dataset.nav, { resetHistory: true }),
  )
})

backButton.addEventListener('click', goBack)

mobileInput.addEventListener('input', updateMobileState)
otpButton.addEventListener('click', showOtpInputs)
resendButton.addEventListener('click', () => {
  startResendTimer()
  otpInputs[0].focus()
})
verifyButton.addEventListener('click', handleVerify)

otpInputs.forEach((input, index) => {
  input.addEventListener('input', (event) => handleOtpInput(index, event.target.value))
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace') {
      handleOtpBackspace(index)
    }
  })
})

clearFilterButton.addEventListener('click', () => {
  state.filters = { date: 'All dates', type: 'All types' }
  renderFilters()
  renderTransactions()
})

sendUpiInput.addEventListener('input', updateSendFlow)
sendUpiNext.addEventListener('click', openSendAmount)
sendAmountInput.addEventListener('input', updateSendAmount)
sendAmountNext.addEventListener('click', openSendConfirm)
sendConfirmButton.addEventListener('click', () => {
  renderStatusCard(statusSamples[0])
  setScreen('status')
})
sendEditButton.addEventListener('click', () => setScreen('send-upi'))

requestUpiInput.addEventListener('input', updateRequestFlow)
requestUpiNext.addEventListener('click', openRequestAmount)
requestAmountInput.addEventListener('input', updateRequestAmount)
requestAmountNext.addEventListener('click', openRequestConfirm)
requestConfirmButton.addEventListener('click', () => {
  renderStatusCard(statusSamples[2])
  setScreen('status')
})
requestEditButton.addEventListener('click', () => setScreen('request-upi'))

statusRetryButton.addEventListener('click', () => {
  const randomStatus = statusSamples[Math.floor(Math.random() * statusSamples.length)]
  renderStatusCard(randomStatus)
})

wireNavigationTargets()
renderQuickActions()
renderServices()
renderSetupStep()
renderFilters()
renderTransactions()
renderStatusCard()
setScreen('login')

