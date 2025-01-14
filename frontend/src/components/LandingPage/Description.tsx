import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { LABELS } from '@/constants';

function Description() {
    return (
        <Box
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800"
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="text-center space-y-6">
                <Typography
                    component={motion.h1}
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    variant='h2'
                    className="text-xl text-slate-100 max-w-2xl mx-auto px-4"

                >
                    {LABELS.PHILOSOPHY_HUB}
                </Typography>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-xl text-slate-300 max-w-2xl mx-auto px-4"
                >
                    {LABELS.EXPLORE_DEPTHS}
                </motion.p>
            </div>
        </Box >
    );
}

export default Description;
