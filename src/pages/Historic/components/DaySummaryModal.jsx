import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Divider,
    Stack,
    Box
} from '@mui/material'
import dayjs from 'dayjs'
import RarityBadge from './RarityBadge'

export default function DaySummaryModal({ open, onClose, date, items }) {
    const total = items.reduce((s, i) => s + i.value, 0)
    const xp = items.reduce((s, i) => s + (i.xp || 0), 0)

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>
                {dayjs(date).format('DD/MM/YYYY')}
            </DialogTitle>

            <DialogContent>
                <Box className="day-summary">
                    <Typography variant="h6">
                        💰 R$ {total.toFixed(2)}
                    </Typography>
                    <Typography color="text.secondary">
                        ⭐ {xp} XP
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                    {items.map((item, i) => (
                        <Box key={i} className="day-item premium-card">
                            <Typography fontWeight={600}>
                                {item.challengeName}
                            </Typography>

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mt={1}
                            >
                                <Typography>
                                    R$ {item.value.toFixed(2)}
                                </Typography>

                                <RarityBadge rarity={item.rarity} />
                            </Box>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                +{item.xp} XP
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
